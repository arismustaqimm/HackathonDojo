/* General preparation guidance, not a claim that any particular employer has these roles open. */
(() => {
  const sectors = {
    finance: {
      label: ["Banking, finance & insurance", "Perbankan, kewangan & insurans"],
      roles: [
        "Banking operations, financial analysis, risk, compliance, actuarial work, investment research and financial technology.",
        "Operasi perbankan, analisis kewangan, risiko, pematuhan, aktuari, penyelidikan pelaburan dan teknologi kewangan.",
      ],
      prepare: [
        "Prepare a clear CV, academic transcript and examples of Excel, analysis, coding or client-facing work relevant to the actual role.",
        "Sediakan CV yang jelas, transkrip akademik dan contoh Excel, analisis, pengaturcaraan atau urusan pelanggan yang berkaitan dengan jawatan sebenar.",
      ],
    },
    tech: {
      label: ["Technology & digital products", "Teknologi & produk digital"],
      roles: [
        "Software engineering, data analytics, product, design, cybersecurity, operations and business functions may be relevant to this sector.",
        "Kejuruteraan perisian, analitik data, produk, reka bentuk, keselamatan siber, operasi dan fungsi perniagaan mungkin berkaitan dengan sektor ini.",
      ],
      prepare: [
        "Bring a focused CV and, where relevant, a GitHub project, portfolio, data case study or product example. Explain what you built and your contribution.",
        "Sediakan CV berfokus dan, jika berkaitan, projek GitHub, portfolio, kajian kes data atau contoh produk. Jelaskan hasil kerja dan sumbangan anda.",
      ],
    },
    energy: {
      label: [
        "Energy & industrial engineering",
        "Tenaga & kejuruteraan industri",
      ],
      roles: [
        "Engineering, geoscience, sustainability, safety, supply chain, finance and digital operations are possible sector pathways.",
        "Kejuruteraan, geosains, kelestarian, keselamatan, rantaian bekalan, kewangan dan operasi digital ialah laluan sektor yang mungkin.",
      ],
      prepare: [
        "Document relevant coursework and technical projects. Check safety, location, site access and placement-duration requirements in each posting.",
        "Rekodkan kursus dan projek teknikal berkaitan. Semak syarat keselamatan, lokasi, akses tapak dan tempoh penempatan dalam setiap iklan.",
      ],
    },
    consulting: {
      label: ["Audit, tax & consulting", "Audit, cukai & perundingan"],
      roles: [
        "Audit, tax, risk, assurance, strategy, technology consulting and data analysis are useful areas to explore.",
        "Audit, cukai, risiko, jaminan, strategi, perundingan teknologi dan analisis data ialah bidang yang boleh diterokai.",
      ],
      prepare: [
        "Prepare academic results, a concise CV and examples of teamwork, structured problem solving and clear communication. Practise explaining a business case.",
        "Sediakan keputusan akademik, CV ringkas dan contoh kerja berpasukan, penyelesaian masalah berstruktur serta komunikasi jelas. Berlatih menerangkan kajian kes perniagaan.",
      ],
    },
    engineering: {
      label: [
        "Engineering, property & infrastructure",
        "Kejuruteraan, hartanah & infrastruktur",
      ],
      roles: [
        "Civil, mechanical and electrical engineering, quantity surveying, project management, property, procurement and corporate functions are sector pathways.",
        "Kejuruteraan awam, mekanikal dan elektrik, ukur bahan, pengurusan projek, hartanah, perolehan dan fungsi korporat ialah laluan sektor.",
      ],
      prepare: [
        "Describe relevant design, lab or site projects and your tools. Confirm whether the placement is office-, site- or field-based and whether travel is required.",
        "Terangkan projek reka bentuk, makmal atau tapak serta alat yang digunakan. Sahkan penempatan pejabat, tapak atau lapangan dan keperluan perjalanan.",
      ],
    },
    consumer: {
      label: [
        "Consumer products & life sciences",
        "Produk pengguna & sains hayat",
      ],
      roles: [
        "Marketing, supply chain, manufacturing, quality, research, sales, finance and data roles may be relevant.",
        "Pemasaran, rantaian bekalan, pembuatan, kualiti, penyelidikan, jualan, kewangan dan data mungkin berkaitan.",
      ],
      prepare: [
        "Use concrete examples of problem solving, analysis or campaign/lab work. Check the business unit, plant or office location in the vacancy.",
        "Gunakan contoh konkrit penyelesaian masalah, analisis atau kerja kempen/makmal. Semak unit perniagaan, kilang atau lokasi pejabat dalam iklan.",
      ],
    },
    telecom: {
      label: ["Telecommunications & networks", "Telekomunikasi & rangkaian"],
      roles: [
        "Network engineering, software, cybersecurity, data, customer products and enterprise services are useful pathways.",
        "Kejuruteraan rangkaian, perisian, keselamatan siber, data, produk pelanggan dan perkhidmatan perusahaan ialah laluan yang berguna.",
      ],
      prepare: [
        "Highlight relevant networking, coding, data or product projects. Distinguish technical placements from commercial roles before applying.",
        "Tonjolkan projek rangkaian, pengaturcaraan, data atau produk yang berkaitan. Bezakan penempatan teknikal daripada peranan komersial sebelum memohon.",
      ],
    },
    public: {
      label: [
        "Public institutions & national development",
        "Institusi awam & pembangunan negara",
      ],
      roles: [
        "Economics, policy, investment, technology, operations, governance and research may be relevant depending on the institution.",
        "Ekonomi, dasar, pelaburan, teknologi, operasi, tadbir urus dan penyelidikan mungkin berkaitan mengikut institusi.",
      ],
      prepare: [
        "Read citizenship, academic and enrolment criteria carefully. Prepare a transcript, concise motivation statement and any university placement letter requested.",
        "Baca syarat kewarganegaraan, akademik dan pendaftaran dengan teliti. Sediakan transkrip, pernyataan motivasi ringkas dan surat penempatan universiti jika diminta.",
      ],
    },
  };
  const map = {
    finance:
      "Maybank|RHB|Public Bank|Jane Street|JPMorgan Chase|AIA Malaysia|Allianz Malaysia|CIMB|Hong Leong Bank|AmBank|Bank Islam|Bank Muamalat|Alliance Bank",
    tech: "Grab|Shopee|Aerodyne|Micron|Intel|Samsung|CARSOME|Cisco|TikTok|Inari Amertron",
    energy:
      "PETRONAS|Shell|SLB|bp|DIALOG Group|TNB|ExxonMobil|Gas Malaysia|Sarawak Energy",
    consulting: "EY|PwC|KPMG|Deloitte",
    engineering:
      "Sime Darby|Gamuda|IJM|SD Guthrie|Sunway|UMW|PLUS|UEM Edgenta|YTL|Mah Sing|IOI Properties|AirAsia",
    consumer: "Nestlé|Unilever|BAT|Abbott",
    telecom: "Maxis|Axiata|CelcomDigi|TM",
    public: "KWSP|Bank Negara Malaysia|PNB|MDEC",
  };
  const lookup = Object.fromEntries(
    Object.entries(map).flatMap(([sector, names]) =>
      names.split("|").map((name) => [name, sector]),
    ),
  );
  window.SCHOLARKU_CAREER_GUIDANCE = {
    sectors,
    sectorFor: (name) => lookup[name] || "tech",
  };
})();
