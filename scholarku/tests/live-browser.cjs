/* Cross-browser flows use a shared intercepted backend. Database policies are tested separately against PostgreSQL. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  vm = require("node:vm"),
  crypto = require("node:crypto");
const base = "http://localhost:5173";
const data = { window: {} };
vm.runInNewContext(fs.readFileSync("mentor-data.js", "utf8"), data);
const actors = {
  a: { id: "11111111-1111-4111-8111-111111111111", name: "Student A" },
  b: { id: "22222222-2222-4222-8222-222222222222", name: "Student B" },
  mentor: { id: "33333333-3333-4333-8333-333333333333", name: "Test Mentor" },
};
const model = {
  memberships: [],
  messages: [],
  requests: [],
  files: new Map(),
  uploads: 0,
  joins: 0,
  failUploadRequest: false,
  sequence: 0,
  mentors: [
    {
      ...data.window.SCHOLARKU_MENTORS[0],
      id: "test-mentor",
      name: "Test Mentor",
      profile_status: "enrolled",
      linked_user_id: actors.mentor.id,
    },
    ...data.window.SCHOLARKU_MENTORS.slice(1),
  ],
};
const equal = (url, key, value) =>
  !url.searchParams.has(key) || url.searchParams.get(key) === "eq." + value;
async function contextFor(browser, actor) {
  const context = await browser.newContext();
  await context.addInitScript(
    ({ actor }) => {
      if (location.origin !== "http://localhost:5173") return;
      const token = [
        "e30",
        btoa(
          JSON.stringify({
            sub: actor.id,
            exp: Math.floor(Date.now() / 1000) + 3600,
          }),
        ),
        "test",
      ].join(".");
      localStorage.setItem(
        "scholarku.auth",
        JSON.stringify({
          access_token: token,
          refresh_token: "test-only",
          user: { id: actor.id },
        }),
      );
    },
    { actor },
  );
  await context.route("**/config.js", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: "window.SCHOLARKU_CONFIG={SUPABASE_URL:'https://live.scholarku.test',SUPABASE_ANON_KEY:'public-test-key'};",
    }),
  );
  await context.route("https://live.scholarku.test/**", async (r) => {
    const req = r.request(),
      url = new URL(req.url()),
      path = decodeURIComponent(url.pathname),
      method = req.method();
    const headers = {
      "access-control-allow-origin": base,
      "access-control-allow-headers":
        "authorization,apikey,content-type,x-upsert",
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    };
    const send = (value, status = 200) =>
      r.fulfill({
        status,
        headers,
        contentType: "application/json",
        body: JSON.stringify(value),
      });
    if (method === "OPTIONS") return r.fulfill({ status: 204, headers });
    if (
      path.startsWith("/storage/v1/object/mentor-cvs/") &&
      method === "POST"
    ) {
      assert.equal(
        req.headers()["content-type"],
        "application/pdf",
        "PDF upload must retain its MIME type",
      );
      const name = path.slice("/storage/v1/object/mentor-cvs/".length);
      assert(name.startsWith(actor.id + "/"));
      const bytes = req.postDataBuffer();
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
      model.files.set(name, bytes);
      model.uploads++;
      return send({ Key: name });
    }
    if (
      path.startsWith("/storage/v1/object/sign/mentor-cvs/") &&
      method === "GET"
    )
      return r.fulfill({
        headers,
        contentType: "application/pdf",
        body: Buffer.from("%PDF-1.4\nTest document"),
      });
    const body = JSON.parse(req.postData() || "{}");
    if (path === "/storage/v1/object/mentor-cvs" && method === "DELETE") {
      for (const name of body.prefixes) {
        assert(name.startsWith(actor.id + "/"));
        model.files.delete(name);
      }
      return send([]);
    }
    if (
      path.startsWith("/storage/v1/object/sign/mentor-cvs/") &&
      method === "POST"
    ) {
      const name = path.slice("/storage/v1/object/sign/mentor-cvs/".length),
        request = model.requests.find((x) => x.cv_path === name),
        mentor =
          request && model.mentors.find((m) => m.id === request.mentor_id);
      if (!name.startsWith(actor.id + "/"))
        assert(
          mentor?.linked_user_id === actor.id &&
            mentor.profile_status === "enrolled",
        );
      assert.equal(body.expiresIn, 60);
      return send({
        signedURL: "/object/sign/mentor-cvs/" + name + "?token=test-only",
      });
    }
    if (path === "/rest/v1/rpc/community_stats")
      return send(
        ["tech", "scholars", "cyber", "design", "finance", "ai"].map((id) => ({
          community_id: id,
          member_count: model.memberships.filter((m) => m.community_id === id)
            .length,
          message_count: model.messages.filter((m) => m.community_id === id)
            .length,
        })),
      );
    if (path === "/rest/v1/rpc/join_community") {
      model.joins++;
      if (
        !model.memberships.some(
          (m) =>
            m.user_id === actor.id && m.community_id === body.p_community_id,
        )
      )
        model.memberships.push({
          user_id: actor.id,
          community_id: body.p_community_id,
        });
      return send(null);
    }
    const table = path.split("/").at(-1);
    if (table === "profiles")
      return send([
        {
          id: actor.id,
          full_name: actor.name,
          role: "student",
          institution: "Test University",
          skills: [],
        },
      ]);
    if (table === "mentors") return send(model.mentors);
    if (table === "community_memberships") {
      const selected = model.memberships.filter(
        (m) =>
          m.user_id === actor.id &&
          equal(url, "user_id", m.user_id) &&
          equal(url, "community_id", m.community_id),
      );
      if (method === "DELETE") {
        model.memberships = model.memberships.filter(
          (m) => !selected.includes(m),
        );
        return send(selected);
      }
      return send(selected);
    }
    if (table === "community_messages") {
      if (method === "POST") {
        if (
          !model.memberships.some(
            (m) =>
              m.user_id === actor.id && m.community_id === body.community_id,
          )
        )
          return send({ message: "Not enrolled" }, 403);
        assert.equal(body.user_id, actor.id);
        if (model.messages.some((m) => m.id === body.id))
          return send({ message: "Duplicate message" }, 409);
        const message = {
          ...body,
          author_name: actor.name,
          created_at: new Date(Date.now() + model.sequence++).toISOString(),
        };
        model.messages.push(message);
        return send([message]);
      }
      return send(
        model.messages
          .filter(
            (m) =>
              model.memberships.some(
                (j) =>
                  j.user_id === actor.id && j.community_id === m.community_id,
              ) &&
              equal(url, "community_id", m.community_id) &&
              equal(url, "channel", m.channel) &&
              equal(url, "id", m.id),
          )
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
      );
    }
    if (table === "mentorship_requests") {
      if (method === "POST") {
        assert.equal(body.user_id, actor.id);
        if (model.failUploadRequest)
          return send({ message: "Simulated rejected request" }, 400);
        if (body.request_type === "cv_review")
          assert(model.files.has(body.cv_path));
        const mentor = model.mentors.find((m) => m.id === body.mentor_id);
        const row = {
          ...body,
          requester_name: actor.name,
          status:
            mentor.profile_status === "enrolled"
              ? "submitted"
              : "waiting_for_mentor",
          created_at: new Date().toISOString(),
        };
        model.requests.push(row);
        return send([row]);
      }
      const rows = model.requests.filter(
        (x) =>
          (x.user_id === actor.id ||
            model.mentors.some(
              (m) => m.id === x.mentor_id && m.linked_user_id === actor.id,
            )) &&
          equal(url, "id", x.id) &&
          equal(url, "user_id", x.user_id),
      );
      if (method === "PATCH") {
        rows.forEach((x) => Object.assign(x, body));
        return send(rows);
      }
      return send(rows);
    }
    return send([]);
  });
  return context;
}
async function join(page) {
  await page.goto(base + "/#/community/cyber");
  await page.click('[data-community-open="cyber"]');
  await page.click('#join-community-form [type="submit"]');
  await page.waitForSelector("#community-message");
}
async function requestForm(page, type) {
  await page.goto(base + "/#/mentors");
  await page.waitForFunction(() =>
    document.querySelector('[data-mentor-request="test-mentor"]'),
  );
  await page.click(
    `[data-mentor-request="test-mentor"][data-request-type="${type}"]`,
  );
  await page.fill(
    "#mentor-topic",
    "Please help improve my SOC analyst CV and career plan.",
  );
  await page.check('[name="consent"]');
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const errors = [];
  try {
    const a = await contextFor(browser, actors.a),
      b = await contextFor(browser, actors.b),
      mentor = await contextFor(browser, actors.mentor);
    for (const c of [a, b, mentor])
      c.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
    const p = await a.newPage(),
      q = await b.newPage(),
      m = await mentor.newPage();
    await p.goto(base + "/#/explore");
    assert.equal(await p.locator('a[href="#/employers"]').count(), 0);
    assert.equal(await p.locator(".sk-card").count(), 10);
    for (const selector of [
      ".sk-card",
      ".sk-search input",
      ".sk-controls select",
    ]) {
      const color = await p
        .locator(selector)
        .first()
        .evaluate((e) => getComputedStyle(e).backgroundColor);
      const rgb = color.match(/\d+/g).map(Number);
      assert(
        rgb[0] < 100 && rgb[1] < 100 && rgb[2] < 130,
        `white component in dark mode: ${selector} ${color}`,
      );
    }
    await p.goto(base + "/#/signup");
    assert.equal(await p.locator("#account-role").count(), 0);
    await p.goto(base + "/#/mentors");
    await p.waitForSelector('[data-mentor-request="test-mentor"]');
    assert.equal(await p.locator(".live-mentor-card").count(), 20);
    const countBefore = model.joins;
    await p.goto(base + "/#/community/cyber");
    await p.click('[data-community-open="cyber"]');
    assert.equal(model.joins, countBefore);
    await p.click("[data-close-dialog]");
    assert.equal(await p.locator("#community-message").count(), 0);
    assert.equal(model.joins, countBefore);
    await join(p);
    assert.equal(model.messages.length, 0);
    assert.match(
      await p.locator("#live-messages").innerText(),
      /Start the conversation/,
    );
    assert(
      await p
        .locator("#community-message")
        .evaluate((e) => e === document.activeElement),
    );
    await p.fill(
      "#community-message",
      "How can I start learning SOC incident response?",
    );
    await p.press("#community-message", "Enter");
    await p.waitForFunction(
      () =>
        document.getElementById("community-message")?.value === "" &&
        !document.getElementById("community-message").readOnly,
    );
    assert(
      await p
        .locator("#community-message")
        .evaluate((e) => e === document.activeElement),
    );
    assert.equal(model.messages.length, 1);
    await join(q);
    await q.waitForSelector("#live-messages .chat-message");
    assert.match(await q.locator("#live-messages").innerText(), /Student A/);
    await q.fill("#community-message", "My unfinished draft");
    await p.fill(
      "#community-message",
      "A second message from another signed-in member.",
    );
    await p.press("#community-message", "Enter");
    await q
      .locator("#live-messages")
      .getByText("A second message from another signed-in member.", {
        exact: true,
      })
      .waitFor();
    assert.equal(
      await q.locator("#community-message").inputValue(),
      "My unfinished draft",
    );
    assert(
      await q
        .locator("#community-message")
        .evaluate((e) => e === document.activeElement),
    );
    await q.press("#community-message", "Enter");
    await q.waitForFunction(
      () => document.getElementById("community-message").value === "",
    );
    assert(
      await q
        .locator("#community-message")
        .evaluate((e) => e === document.activeElement),
    );
    await q.click('[data-live-channel="soc-careers"]');
    assert(
      await q
        .locator("#community-message")
        .evaluate((e) => e === document.activeElement),
    );
    await q.fill("#community-message", "Draft survives language changes");
    await q.click("#sk-lang");
    await q.click('[data-language="bm"]');
    await q.waitForSelector("#community-message");
    assert.equal(
      await q.locator("#community-message").inputValue(),
      "Draft survives language changes",
    );
    assert(
      await q
        .locator('[data-live-channel="soc-careers"]')
        .evaluate((e) => e.classList.contains("active")),
    );
    await requestForm(p, "cv_review");
    assert(await p.locator("#mentor-cv").isVisible());
    const uploadedBefore = model.uploads;
    await p.setInputFiles("#mentor-cv", {
      name: "invalid.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("Not a PDF document"),
    });
    await p.click('#mentorship-request-form [type="submit"]');
    await p.waitForSelector("#mentorship-request-form .live-message.error");
    assert.match(
      await p
        .locator("#mentorship-request-form [data-live-message]")
        .innerText(),
      /valid PDF/,
    );
    assert.equal(model.uploads, uploadedBefore);
    await p.setInputFiles("#mentor-cv", {
      name: "cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\nTest CV for browser verification\n%%EOF"),
    });
    await p.click('#mentorship-request-form [type="submit"]');
    await p.waitForURL("**/#/mentors/requests");
    assert.equal(model.uploads, uploadedBefore + 1);
    assert.equal(model.requests.length, 1);
    assert.equal(model.requests[0].status, "submitted");
    await p.waitForSelector(".mentor-request-row");
    await m.goto(base + "/#/mentors/requests");
    await m.waitForSelector('[data-request-status="accepted"]');
    assert.match(
      await m.locator("#mentor-requests-list").innerText(),
      /Student A/,
    );
    const filePopup = m.waitForEvent("popup");
    await m.click("[data-mentor-cv]");
    const file = await filePopup;
    await file.waitForURL("https://live.scholarku.test/**");
    await file.close();
    await m.click('[data-request-status="accepted"]');
    await m.waitForSelector('[data-request-status="completed"]');
    assert.equal(model.requests[0].status, "accepted");
    await m.fill(
      ".mentor-reply-form textarea",
      "Add measurable impact to your SOC project and explain your investigation steps.",
    );
    await m.click('.mentor-reply-form button[type="submit"]');
    await m
      .locator(".mentor-feedback")
      .getByText(
        "Add measurable impact to your SOC project and explain your investigation steps.",
        { exact: true },
      )
      .waitFor();
    await p.bringToFront();
    await p
      .locator("#mentor-requests-list")
      .getByText("Accepted", { exact: true })
      .waitFor({ timeout: 15000 });
    assert.match(
      await p.locator("#mentor-requests-list").innerText(),
      /Accepted/,
    );
    await p
      .locator(".mentor-feedback")
      .getByText(
        "Add measurable impact to your SOC project and explain your investigation steps.",
        { exact: true },
      )
      .waitFor();
    await requestForm(p, "session");
    assert.equal(await p.locator("#mentor-cv").isVisible(), false);
    const beforeSession = model.uploads;
    await p.click('#mentorship-request-form [type="submit"]');
    await p.waitForURL("**/#/mentors/requests");
    assert.equal(model.uploads, beforeSession);
    assert.equal(model.requests.at(-1).cv_path, null);
    const filesBefore = model.files.size;
    model.failUploadRequest = true;
    await requestForm(p, "cv_review");
    await p.setInputFiles("#mentor-cv", {
      name: "orphan.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\nTemporary test file"),
    });
    await p.click('#mentorship-request-form [type="submit"]');
    await p.waitForSelector("#mentorship-request-form .live-message.error");
    assert.equal(
      model.files.size,
      filesBefore,
      "failed request must remove a confirmed orphaned upload",
    );
    model.failUploadRequest = false;
    await p.click("[data-close-dialog]");
    await p.goto(base + "/#/scholarships");
    assert.equal(await p.locator(".sk-card").count(), 10);
    for (const id of [
      "flysiswa",
      "doha-graduate",
      "ntu-research",
      "khazanah-postgraduate",
    ]) {
      await p.goto(base + "/#/funding/" + id);
      assert((await p.locator(".opportunity-prose").innerText()).length > 1200);
      assert.match(
        await p.locator(".opportunity-prose").innerText(),
        /official confirmation/,
      );
    }
    await p.goto(base + "/#/careers/internships/maybank");
    assert.match(
      await p.locator(".opportunity-prose").innerText(),
      /Apply step by step/,
    );
    assert.match(
      await p.locator(".opportunity-facts").innerText(),
      /Allowance/,
    );
    await p.setViewportSize({ width: 390, height: 844 });
    for (const path of [
      "/mentors",
      "/community",
      "/careers/internships/maybank",
      "/funding/flysiswa",
    ]) {
      await p.goto(base + "/#" + path);
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `mobile overflow ${path}`,
      );
    }
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.goto(base + "/#/mentors");
    await p.screenshot({
      path: "/tmp/scholarku-mentors-v4.png",
      fullPage: true,
    });
    await p.goto(base + "/#/careers/internships/maybank");
    await p.screenshot({
      path: "/tmp/scholarku-career-guide-v4.png",
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    console.log(
      "PASS: dark Explore controls; employer removal; 20 sourced profiles; community enrolment/cancel; two-account shared messages; composer focus and drafts across polling/language changes; private PDF MIME/upload, invalid file rejection, cleanup and selected mentor inbox; session requests; 4 funding guides; career detail; mobile layouts. Browser backend responses were intercepted; PostgreSQL RLS is tested in database.test.mjs.",
    );
    await a.close();
    await b.close();
    await mentor.close();
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
