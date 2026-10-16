/* One reversible locale layer for all routes, dialogs and notifications.
   Source strings and option values stay intact; personal names are not translated. */
(()=>{'use strict';
const catalogue = `
Explore|Teroka
Internships|Latihan industri
Scholarships|Biasiswa
Community|Komuniti
Mock tests|Ujian percubaan
Mentorship|Bimbingan mentor
For employers|Untuk majikan
Log in|Log masuk
Join for free|Daftar percuma
Dashboard|Papan pemuka
My dashboard|Papan pemuka saya
Log out / switch demo role|Log keluar / tukar peranan demo
Toggle navigation|Buka atau tutup navigasi
Main navigation|Navigasi utama
Scholarku home|Laman utama Scholarku
Discover|Teroka
Connect|Berhubung
CONNECT|BERHUBUNG
FUND|PEMBIAYAAN
LAUNCH|KERJAYA
Student communities|Komuniti pelajar
Find a mentor|Cari mentor
Our promise|Janji kami
Employer verification|Pengesahan majikan
Demo data policy|Dasar data demo
Privacy & safety|Privasi & keselamatan
Hackathon demonstration|Demonstrasi hackathon
Made for Malaysian students 🇲🇾|Dibangunkan untuk pelajar Malaysia 🇲🇾
One place to discover opportunities, build skills, meet peers, and take your next big step. Built for students in Malaysia.|Satu platform untuk meneroka peluang, membina kemahiran, berkenalan dengan rakan dan memulakan langkah seterusnya. Dibangunkan untuk pelajar di Malaysia.
© 2026 Scholarku. Hackathon prototype — not affiliated with MyScholar, Unstop or the fictional demo organizations.|© 2026 Scholarku. Prototaip hackathon — tiada kaitan dengan MyScholar, Unstop atau organisasi demo rekaan.
Events & competitions|Acara & pertandingan
Mock assessments|Penilaian percubaan
All|Semua
All Fields|Semua bidang
All Levels|Semua peringkat
All Locations|Semua lokasi
All Types|Semua jenis
Any Contract|Semua jenis kontrak
Any Mode|Semua aturan kerja
All Industries|Semua industri
Internship|Latihan industri
Graduate Programme|Program graduan
Graduate programmes|Program graduan
Scholarship|Biasiswa
Competition|Pertandingan
Workshop|Bengkel
Technology|Teknologi
Finance|Kewangan
Education|Pendidikan
Business|Perniagaan
Computer Science|Sains komputer
Data Science|Sains data
Cybersecurity|Keselamatan siber
IT & Networking|IT & rangkaian
Design|Reka bentuk
Consulting|Perundingan
Energy|Tenaga
Banking|Perbankan
Foundation|Yayasan
Government|Kerajaan
Private|Swasta
Company|Syarikat
Industry|Industri
Organization|Organisasi
Organization category|Kategori organisasi
Fresh Graduate|Graduan baharu
Undergraduate|Prasiswazah
Remote|Jarak jauh
On-site|Di lokasi
Hybrid|Hibrid
Nationwide|Seluruh negara
Malaysia-wide|Seluruh Malaysia
Not specified|Tidak dinyatakan
With contract|Dengan kontrak
No contract|Tanpa kontrak
Search listings|Cari peluang
Search title, provider, skills...|Cari tajuk, penyedia, kemahiran...
Field of study|Bidang pengajian
Location|Lokasi
Work arrangement|Aturan kerja
Education level|Peringkat pendidikan
Graduate programme contract|Kontrak program graduan
Reset|Tetapkan semula
Showing|Memaparkan
opportunities|peluang
Sample listings clearly labelled|Senarai contoh dilabel dengan jelas
Explore opportunities|Terokai peluang
THE NEXT STEP STARTS HERE|LANGKAH SETERUSNYA BERMULA DI SINI
Scholarships, internships, graduate programmes, workshops and competitions — in one convenient place.|Biasiswa, latihan industri, program graduan, bengkel dan pertandingan — semuanya dalam satu platform.
No matching opportunities|Tiada peluang yang sepadan
Try a different keyword, location or field.|Cuba kata kunci, lokasi atau bidang lain.
Clear filters|Kosongkan penapis
BUILD CONFIDENCE|BINA KEYAKINAN
Practice for internship tests and graduate programme hiring rounds — with transparent sample questions.|Berlatih untuk ujian latihan industri dan saringan program graduan dengan soalan contoh yang jelas.
Practice environment only.|Untuk latihan sahaja.
This demo does not offer identity verification, browser proctoring, anti-cheat monitoring or official company assessments. The full mock follows your sample 90-minute format: 15 + 30 + 1 questions across three timed sections.|Demo ini tidak menyediakan pengesahan identiti, pengawasan pelayar, pemantauan penipuan atau penilaian rasmi syarikat. Ujian percubaan penuh menggunakan format 90 minit: 15 + 30 + 1 soalan dalam tiga bahagian bermasa.
How the assessment works|Cara penilaian dijalankan
15 min · Technical & aptitude|15 minit · Teknikal & aptitud
Answer 15 multiple-choice questions one at a time.|Jawab 15 soalan aneka pilihan satu demi satu.
30 min · HR & behavioural|30 minit · Sumber manusia & tingkah laku
Complete 30 workplace reasoning questions.|Lengkapkan 30 soalan penaakulan di tempat kerja.
45 min · Case response|45 minit · Respons kajian kes
Submit one written situational judgement response.|Hantar satu respons bertulis bagi penilaian situasi.
Each answer is locked once submitted. You cannot return to a previous section. Demo progress is stored on this device.|Setiap jawapan dikunci selepas dihantar. Anda tidak boleh kembali ke bahagian sebelumnya. Kemajuan demo disimpan pada peranti ini.
Start full mock assessment|Mulakan penilaian percubaan penuh
Start practice|Mulakan latihan
Question progress|Kemajuan soalan
Exit to practice menu|Kembali ke menu latihan
Your case response|Respons kajian kes anda
Next question|Soalan seterusnya
Next section|Bahagian seterusnya
Finish assessment|Tamatkan penilaian
Well done for completing your practice!|Tahniah kerana melengkapkan latihan anda!
You scored|Markah anda
on the multiple-choice questions. The case response requires human review.|bagi soalan aneka pilihan. Respons kajian kes perlu disemak oleh manusia.
This is a practice score, not an employer assessment or hiring recommendation.|Ini ialah markah latihan, bukan penilaian majikan atau cadangan pengambilan pekerja.
Retake assessment|Ulang penilaian
To maintain the test flow, previously submitted responses cannot be changed. The next section starts a new timer.|Bagi mengekalkan aliran ujian, respons yang telah dihantar tidak boleh diubah. Pemasa baharu bermula pada bahagian seterusnya.
YOUR PEOPLE ARE HERE|KOMUNITI ANDA DI SINI
Find your community|Cari komuniti anda
Meet like-minded students, share achievements, and learn in topic-based channels.|Temui pelajar yang berkongsi minat, kongsikan pencapaian dan belajar melalui saluran mengikut topik.
Discover communities|Terokai komuniti
Discord-inspired topic channels · Browser demo chat · No voice calling yet|Saluran topik berinspirasikan Discord · Sembang demo dalam pelayar · Panggilan suara belum tersedia
Share an achievement|Kongsi pencapaian
Enter community|Sertai komuniti
Teach a skill. Learn a skill.|Kongsi kemahiran. Pelajari kemahiran baharu.
Join the skill-exchange channel to trade what you know — coding, design, SQL, presentations and more.|Sertai saluran pertukaran kemahiran untuk berkongsi pengetahuan tentang pengaturcaraan, reka bentuk, SQL, pembentangan dan banyak lagi.
Browse skill exchange|Terokai pertukaran kemahiran
STUDENT CONNECT|JARINGAN PELAJAR
Small wins. Big inspiration.|Pencapaian kecil. Inspirasi besar.
See what students are building and celebrating. Posts below are examples for the demo.|Lihat projek dan pencapaian pelajar. Hantaran di bawah ialah contoh demo.
Demo community post|Hantaran komuniti demo
Achievement|Pencapaian
Project|Projek
Tech & coding|Teknologi & pengaturcaraan
Scholarship tips|Tip biasiswa
AI & data|AI & data
Creators|Pencipta
Student community|Komuniti pelajar
TEXT CHANNELS|SALURAN TEKS
VOICE LOUNGE|RUANG SUARA
DEMO CHAT · STORED IN YOUR BROWSER|SEMBANG DEMO · DISIMPAN DALAM PELAYAR ANDA
← All communities|← Semua komuniti
Send message|Hantar mesej
Message|Mesej
YOUR NEXT CHAPTER|BAB SETERUSNYA ANDA
Learn from someone who's been there.|Belajar daripada mereka yang berpengalaman.
Meet our sample mentors|Kenali mentor contoh kami
Profiles below are fictional examples; no sessions will be booked with real professionals. Live mentor verification and scheduling integrations are planned.|Profil di bawah ialah contoh rekaan; tiada sesi ditempah dengan profesional sebenar. Pengesahan mentor dan penyepaduan jadual untuk perkhidmatan sebenar dirancang.
Choose a topic, prepare your questions, and practise reaching out.|Pilih topik, sediakan soalan dan berlatih menghubungi mentor.
Request session|Mohon sesi
Request mentorship|Mohon bimbingan mentor
Request a CV review|Mohon semakan CV
Request a mentoring session|Mohon sesi bimbingan mentor
What would you like help with?|Apakah bantuan yang anda perlukan?
What would you like feedback on?|Apakah perkara yang anda mahu dapatkan maklum balas?
CV feedback, career planning, interview tips...|Maklum balas CV, perancangan kerjaya, tip temu duga...
My software engineering CV and project descriptions...|CV kejuruteraan perisian dan penerangan projek saya...
Record a sample review request. Files are not uploaded in demo mode.|Rekodkan permohonan semakan contoh. Fail tidak dimuat naik dalam mod demo.
Attach CV (optional; not uploaded in demo)|Lampirkan CV (pilihan; tidak dimuat naik dalam demo)
Save demo request|Simpan permohonan demo
Save request|Simpan permohonan
Close|Tutup
Create an account|Cipta akaun
Welcome back|Selamat kembali
Welcome back!|Selamat kembali!
I'm a student|Saya pelajar
I'm an employer|Saya majikan
Full name|Nama penuh
Email|E-mel
Password|Kata laluan
Institution|Institusi
Student|Pelajar
Employer|Majikan
Admin|Pentadbir
Demo mode|Mod demo
No Supabase credentials have been configured. Use the demo roles below to explore the interface; data will stay in this browser.|Maklumat akses Supabase belum dikonfigurasi. Gunakan peranan demo di bawah untuk menerokai antara muka; data disimpan dalam pelayar ini.
Continue as student|Teruskan sebagai pelajar
Continue as employer|Teruskan sebagai majikan
Continue as admin|Teruskan sebagai pentadbir
Already have an account?|Sudah mempunyai akaun?
Don't have an account?|Belum mempunyai akaun?
Sign up|Daftar
My applications|Permohonan saya
Saved opportunities|Peluang disimpan
My listings|Senarai saya
Overview|Gambaran keseluruhan
Profile|Profil
Applications|Permohonan
Saved|Disimpan
Mentor requests|Permohonan bimbingan mentor
Organization profile|Profil organisasi
Applicant management|Pengurusan pemohon
Verification|Pengesahan
Student profile|Profil pelajar
A stronger profile helps you keep track of your goals and preferred fields.|Profil yang lengkap membantu anda menjejaki matlamat dan bidang pilihan.
Skills (comma separated)|Kemahiran (pisahkan dengan koma)
Preferred location|Lokasi pilihan
Save profile|Simpan profil
Student profile updated|Profil pelajar dikemas kini
Applications sent|Permohonan dihantar
Recent applications|Permohonan terkini
No applications yet|Belum ada permohonan
Submitted internship applications will appear here.|Permohonan latihan industri yang dihantar akan dipaparkan di sini.
Browse opportunities|Terokai peluang
Mentor requests (demo)|Permohonan bimbingan mentor (demo)
Applicant|Pemohon
Opportunity|Peluang
Status|Status
Action|Tindakan
Withdraw|Tarik balik
View CV|Lihat CV
Submitted|Dihantar
Withdrawn|Ditarik balik
Shortlisted|Disenarai pendek
Rejected|Ditolak
Accepted|Diterima
Pending Review|Menunggu semakan
Not submitted|Belum dihantar
Approved|Diluluskan
My opportunity listings|Senarai peluang saya
Publish an internship|Terbitkan latihan industri
No listings yet.|Belum ada senarai.
No applications received yet.|Belum ada permohonan diterima.
Applicants (visible)|Pemohon (boleh dilihat)
Organization name|Nama organisasi
Organization type|Jenis organisasi
State / city|Negeri / bandar
Official website|Laman rasmi
Registration no. (if applicable)|Nombor pendaftaran (jika berkenaan)
Save organization|Simpan organisasi
Request verification|Mohon pengesahan
Supporting details / registration information|Maklumat sokongan / pendaftaran
Document (PDF or image; private in live mode)|Dokumen (PDF atau imej; peribadi dalam mod sebenar)
A registration number alone does not count as approval. You can provide context and optionally supporting evidence for admin review.|Nombor pendaftaran sahaja tidak bermakna kelulusan. Berikan maklumat berkaitan dan, jika ada, bukti sokongan untuk semakan pentadbir.
Organization profile saved|Profil organisasi disimpan
Verification request submitted for review|Permohonan pengesahan dihantar untuk semakan
Only approved employers can publish a live listing.|Hanya majikan yang diluluskan boleh menerbitkan peluang sebenar.
Create internship opportunity|Cipta peluang latihan industri
Only approved employers can publish a listing. Do not invent salary or deadlines.|Hanya majikan yang diluluskan boleh menerbitkan peluang. Jangan mereka gaji atau tarikh tutup.
Internship title|Tajuk latihan industri
State|Negeri
Duration|Tempoh
Description and requirements|Penerangan dan syarat
Publish internship|Terbitkan latihan industri
Frontend Developer Intern|Pelatih pembangun bahagian hadapan
3 months|3 bulan
Describe tasks, required skills and eligibility...|Terangkan tugas, kemahiran yang diperlukan dan kelayakan...
Employer verification queue|Senarai semakan pengesahan majikan
Pending reviews|Semakan tertangguh
Approved organizations|Organisasi diluluskan
Published listings|Peluang diterbitkan
Submitted evidence|Bukti dihantar
Evidence|Bukti
Decision|Keputusan
Approve|Luluskan
Reject|Tolak
Sample organization|Organisasi contoh
Find students. Build tomorrow's talent.|Temui pelajar. Bina bakat masa hadapan.
Organizations can register, provide verification evidence, publish internship listings after approval and manage applicants in one dashboard.|Organisasi boleh mendaftar, memberikan bukti pengesahan, menerbitkan peluang latihan industri selepas kelulusan dan mengurus pemohon melalui satu papan pemuka.
Set up your organization|Sediakan profil organisasi anda
Complete a company, university, agency, or eligible nonprofit profile.|Lengkapkan profil syarikat, universiti, agensi atau organisasi bukan untung yang layak.
Get reviewed|Dapatkan semakan
Submit supporting information to an administrator for a genuine verification decision.|Hantar maklumat sokongan kepada pentadbir untuk keputusan pengesahan sebenar.
Publish & review applicants|Terbitkan & semak pemohon
Approved organizations can create listings and manage student applications.|Organisasi yang diluluskan boleh menerbitkan peluang dan mengurus permohonan pelajar.
How employer verification works|Cara pengesahan majikan dijalankan
Verified, with evidence|Disahkan berdasarkan bukti
What verified means|Maksud pengesahan
Scholarku does not automatically approve an organization just because a website, email or registration number was submitted. A review decision is required.|Scholarku tidak meluluskan organisasi secara automatik hanya kerana laman web, e-mel atau nombor pendaftaran telah dihantar. Keputusan semakan diperlukan.
Demo versus real opportunities|Peluang demo berbanding peluang sebenar
Every invented employer, vacancy, mentor, event and scholarship in this build is labelled as demo material. Demo admin approvals are simulated reviews and must not be mistaken for independent validation.|Setiap majikan, kekosongan, mentor, acara dan biasiswa rekaan dilabel sebagai bahan demo. Kelulusan pentadbir demo ialah simulasi semakan dan bukan pengesahan bebas.
Protecting your documents|Melindungi dokumen anda
When the Supabase backend is configured, application files are stored in private buckets protected by authentication and database rules. In local demo mode, the app does not upload your CV to any server.|Apabila sistem Supabase dikonfigurasi, fail permohonan disimpan dalam storan peribadi yang dilindungi oleh pengesahan dan peraturan pangkalan data. Dalam mod demo setempat, CV anda tidak dimuat naik ke mana-mana pelayan.
Spot a suspicious listing|Kenal pasti senarai yang mencurigakan
Cross-check registration details with the relevant official authority and confirm that the company owns the contact channel.|Semak maklumat pendaftaran dengan pihak berkuasa rasmi berkaitan dan pastikan saluran perhubungan dimiliki oleh syarikat tersebut.
Be wary of requests for application payments, personal banking credentials, or off-platform identity documents before you have verified the organization.|Berhati-hati dengan permintaan bayaran permohonan, maklumat akses perbankan peribadi atau dokumen identiti di luar platform sebelum anda mengesahkan organisasi tersebut.
Share your milestone|Kongsi pencapaian anda
Let other students know what you learned or achieved.|Kongsikan pembelajaran atau pencapaian anda dengan pelajar lain.
Post title|Tajuk hantaran
Tell your story|Kongsi cerita anda
I finished my first hackathon!|Saya telah menyertai hackathon pertama saya!
What did you learn? How can others get involved?|Apakah yang anda pelajari? Bagaimanakah orang lain boleh turut serta?
Publish sample post|Terbitkan hantaran contoh
Achievement shared in demo community|Pencapaian dikongsi dalam komuniti demo
About this opportunity|Tentang peluang ini
Relevant skills & areas|Kemahiran & bidang berkaitan
Eligibility & requirements|Kelayakan & syarat
Opportunity snapshot|Ringkasan peluang
Arrangement|Aturan kerja
Allowance|Elaun
Contract status|Status kontrak
Verification status|Status pengesahan
Not independently verified|Belum disahkan secara bebas
Reviewed & approved|Disemak & diluluskan
Demonstration listing:|Senarai demonstrasi:
This opportunity and organization are fictional. It is not an active vacancy, scholarship or event, and no application will be sent to an employer.|Peluang dan organisasi ini ialah rekaan. Ini bukan kekosongan, biasiswa atau acara aktif, dan tiada permohonan dihantar kepada majikan.
Never pay an application fee to an unknown recruiter or share sensitive personal details outside a trusted hiring process.|Jangan bayar yuran permohonan kepada perekrut yang tidak dikenali atau kongsi maklumat peribadi sensitif di luar proses pengambilan yang dipercayai.
Save for later|Simpan untuk kemudian
Apply for internship|Mohon latihan industri
Express interest|Nyatakan minat
Report listing|Laporkan senarai
Report suspicious listing|Laporkan senarai mencurigakan
Reports are reviewed by authorized administrators.|Laporan disemak oleh pentadbir yang diberi kuasa.
Reason|Sebab
Explain what looks suspicious...|Terangkan perkara yang mencurigakan...
Submit report|Hantar laporan
Report submitted|Laporan dihantar
Short cover note|Nota pengenalan ringkas
Upload CV (PDF; max 5MB)|Muat naik CV (PDF; maksimum 5MB)
Submit application|Hantar permohonan
Why are you a good fit?|Mengapakah anda sesuai untuk peluang ini?
Save this sample instead|Simpan contoh ini
Fictional demo vacancies are not accepting real applications. This protects you from submitting personal documents to a non-existent company.|Kekosongan demo rekaan tidak menerima permohonan sebenar. Ini mengelakkan anda menghantar dokumen peribadi kepada syarikat yang tidak wujud.
Saved to your shortlist|Disimpan dalam senarai pilihan anda
Removed from shortlist|Dikeluarkan daripada senarai pilihan
Demo mentor request saved to dashboard|Permohonan bimbingan mentor demo disimpan pada papan pemuka
Demo CV review request saved — no files uploaded|Permohonan semakan CV demo disimpan — tiada fail dimuat naik
Signed out|Telah log keluar
Demo session ended|Sesi demo tamat
Something went wrong|Ralat telah berlaku
Submit an answer first|Hantar jawapan terlebih dahulu
Time is up for this section|Masa untuk bahagian ini telah tamat
← Back to explore|← Kembali ke halaman teroka
Welcome to this community channel!|Selamat datang ke saluran komuniti ini!
Community guide|Panduan komuniti
Pinned|Disematkan
Just finished my first CTF!|Baru selesai CTF pertama saya!
I joined a beginner capture-the-flag workshop and finally solved my first forensics challenge. If you are curious, try one!|Saya menyertai bengkel capture-the-flag untuk pemula dan berjaya menyelesaikan cabaran forensik pertama saya. Jika berminat, cubalah!
Hackathon team assembled 🚀|Pasukan hackathon telah dibentuk 🚀
We built a prototype for a university challenge. Next goal: an AI agent workshop and a datathon!|Kami membina prototaip untuk cabaran universiti. Sasaran seterusnya: bengkel ejen AI dan datathon!
View details|Lihat butiran
DEMO · NOT A REAL VACANCY|DEMO · BUKAN KEKOSONGAN SEBENAR
Online|Dalam talian
Software Engineering Intern|Pelatih kejuruteraan perisian
Future Innovators Scholarship|Biasiswa Inovator Masa Hadapan
Build for Good Hackathon|Hackathon Bina untuk Kebaikan
Data Analytics Intern|Pelatih analitik data
AI Agents: From Idea to Prototype|Ejen AI: Daripada idea kepada prototaip
Cybersecurity Analyst Intern|Pelatih penganalisis keselamatan siber
Emerging Leaders Bursary|Bantuan Kewangan Pemimpin Baharu
Campus Data Challenge|Cabaran Data Kampus
UI/UX Product Design Intern|Pelatih reka bentuk produk UI/UX
Finance & Quant Research Intern|Pelatih penyelidikan kewangan & kuantitatif
Digital Graduate Associate|Eksekutif graduan digital
Marketing & Growth Intern|Pelatih pemasaran & pertumbuhan
Capture the Flag Bootcamp|Kem intensif Capture the Flag
Future Finance Trainee|Pelatih kewangan masa hadapan
Network Engineering Intern|Pelatih kejuruteraan rangkaian
Developers, hackathons, open source and student tech projects.|Pembangun, hackathon, sumber terbuka dan projek teknologi pelajar.
Applications, interview prep, funding tips and peer support.|Permohonan, persediaan temu duga, tip pembiayaan dan sokongan rakan sebaya.
CTFs, ethical hacking, Linux labs, and beginner-friendly learning.|CTF, penggodaman beretika, makmal Linux dan pembelajaran mesra pemula.
Figma critiques, portfolios, UI/UX and creative challenges.|Ulasan Figma, portfolio, UI/UX dan cabaran kreatif.
Finance careers, interview prep, markets and analytics.|Kerjaya kewangan, persediaan temu duga, pasaran dan analitik.
AI agents, datathons, models, demos and meetup planning.|Ejen AI, datathon, model, demo dan perancangan pertemuan.
Project · Demo community post|Projek · Hantaran komuniti demo
Achievement · Demo community post|Pencapaian · Hantaran komuniti demo
COMMUNITY SPACE|RUANG KOMUNITI
Student lounge|Ruang santai pelajar
Student conversation|Perbualan pelajar
Pinned message|Mesej disematkan
Demo example|Contoh demo
What opportunity are you working towards this semester?|Apakah peluang yang anda sasarkan pada semester ini?
LEARN FROM EXPERIENCE|BELAJAR DARIPADA PENGALAMAN
Mentorship that moves you forward|Bimbingan mentor untuk kemajuan anda
Discover student-friendly mentor profiles, request CV feedback, or practise a career conversation.|Terokai profil mentor mesra pelajar, mohon maklum balas CV atau berlatih berbincang tentang kerjaya.
Software Engineering|Kejuruteraan perisian
Software Engineer · Industry mentor (demo)|Jurutera perisian · Mentor industri (demo)
Portfolio review, software engineering pathways, and internship preparation.|Semakan portfolio, laluan kejuruteraan perisian dan persediaan latihan industri.
Request a session|Mohon sesi
Data & Analytics|Data & analitik
Data Analyst · Industry mentor (demo)|Penganalisis data · Mentor industri (demo)
Python, SQL, project storytelling, and technical interview practice.|Python, SQL, pembentangan projek dan latihan temu duga teknikal.
CV & Career|CV & kerjaya
Talent & Recruitment · Mentor (demo)|Bakat & pengambilan pekerja · Mentor (demo)
Resume reviews, behavioural interviews, and career direction.|Semakan resume, temu duga tingkah laku dan hala tuju kerjaya.
Security Consultant · Mentor (demo)|Perunding keselamatan · Mentor (demo)
CTF learning paths, SOC roles, and hands-on security skill development.|Laluan pembelajaran CTF, peranan SOC dan pembangunan kemahiran keselamatan secara praktikal.
UX Researcher · Mentor (demo)|Penyelidik UX · Mentor (demo)
Design portfolios, case studies and user research foundations.|Portfolio reka bentuk, kajian kes dan asas penyelidikan pengguna.
Finance Analyst · Mentor (demo)|Penganalisis kewangan · Mentor (demo)
Financial modelling, case preparation and early career choices.|Pemodelan kewangan, persediaan kajian kes dan pilihan kerjaya awal.
Aptitude & Technical Foundations|Asas aptitud & teknikal
Logic, data interpretation, programming fundamentals, and reasoning.|Logik, tafsiran data, asas pengaturcaraan dan penaakulan.
Start assessment|Mulakan penilaian
Career readiness|Kesediaan kerjaya
HR & Behavioural Assessment|Penilaian sumber manusia & tingkah laku
Workplace situations, communication and professional judgement.|Situasi di tempat kerja, komunikasi dan pertimbangan profesional.
Case study|Kajian kes
Situational Judgement Case|Kajian kes penilaian situasi
Write a considered response to a realistic team scenario.|Tulis respons yang teliti terhadap senario pasukan yang realistik.
FOR ORGANIZATIONS|UNTUK ORGANISASI
Meet your next great intern|Temui pelatih berbakat anda
Create a verified employer profile and connect with students across Malaysia.|Cipta profil majikan yang disahkan dan berhubung dengan pelajar di seluruh Malaysia.
Register organization|Daftar organisasi
Read verification policy|Baca dasar pengesahan
YOUR SPACE|RUANG ANDA
Your student dashboard|Papan pemuka pelajar anda
Save opportunities and monitor your applications.|Simpan peluang dan pantau permohonan anda.
Create your student space|Cipta ruang pelajar anda
Log in or try the demo to see a personalized dashboard.|Log masuk atau cuba demo untuk melihat papan pemuka peribadi.
Join Scholarku|Sertai Scholarku
SAFETY IS A FEATURE|KESELAMATAN SEBAGAI CIRI UTAMA
Trust, without false promises|Kepercayaan tanpa janji palsu
Understand exactly what Scholarku reviews — and what verification does not mean.|Fahami perkara yang disemak oleh Scholarku dan batas pengesahan tersebut.
Employer profile|Profil majikan
An organization registers and submits its legal name, official contact and relevant documents.|Organisasi mendaftar dan menghantar nama berdaftar, maklumat perhubungan rasmi serta dokumen berkaitan.
Human administrator review|Semakan oleh pentadbir
An authorized reviewer assesses submitted evidence, asks for more information or rejects a request.|Penyemak yang diberi kuasa menilai bukti yang dihantar, meminta maklumat lanjut atau menolak permohonan.
Decision & audit trail|Keputusan & jejak audit
Only approved organizations can post active internships. Decisions are logged and can be revoked.|Hanya organisasi yang diluluskan boleh menerbitkan latihan industri aktif. Keputusan direkodkan dan boleh ditarik balik.
A verified indicator means an authorized Scholarku administrator reviewed the organization's submission according to platform policy. It does|Penunjuk pengesahan bermaksud pentadbir Scholarku yang diberi kuasa telah menyemak maklumat organisasi mengikut dasar platform. Ini
not|tidak
mean endorsement by SSM, any government agency, or the university, and it does not guarantee a position is safe or legitimate forever.|bermakna sokongan daripada SSM, mana-mana agensi kerajaan atau universiti, dan tidak menjamin sesuatu jawatan sentiasa selamat atau sah.
Browse internships|Terokai latihan industri
Welcome to Scholarku|Selamat datang ke Scholarku
Log in to continue your student journey.|Log masuk untuk meneruskan perjalanan anda sebagai pelajar.
Enter as demo student|Masuk sebagai pelajar demo
Enter as demo employer|Masuk sebagai majikan demo
Enter as demo administrator|Masuk sebagai pentadbir demo
All demo profiles and opportunities are fictional.|Semua profil dan peluang demo ialah rekaan.
Join the student opportunity hub.|Sertai hab peluang pelajar.
Opportunity details|Butiran peluang
Review the provider, eligibility and important information before applying.|Semak penyedia, kelayakan dan maklumat penting sebelum memohon.
Always verify exact requirements through the organizer's official channels.|Sentiasa sahkan syarat sebenar melalui saluran rasmi penganjur.
Field:|Bidang:
Education:|Pendidikan:
3–6 months|3–6 bulan
6 months|6 bulan
4 months|4 bulan
12 months · sample|12 bulan · contoh
18 months · sample|18 bulan · contoh
Fictional demo employer.|Majikan demo rekaan.
Collaborate with a small product team to build web applications, test new features, and learn practical software engineering workflows. Fictional vacancy for demonstration only.|Bekerjasama dengan pasukan produk kecil untuk membina aplikasi web, menguji ciri baharu dan mempelajari aliran kerja kejuruteraan perisian secara praktikal. Kekosongan rekaan untuk demonstrasi sahaja.
Sample scholarship illustrating a need-and-merit based financial aid listing. Not a real scholarship; verify actual opportunities with official providers.|Contoh biasiswa yang menggambarkan bantuan kewangan berdasarkan keperluan dan merit. Ini bukan biasiswa sebenar; sahkan peluang sebenar dengan penyedia rasmi.
A sample weekend team hackathon where participants prototype meaningful solutions to local problems. For demonstration only.|Contoh hackathon berkumpulan pada hujung minggu untuk membina prototaip penyelesaian kepada masalah setempat. Untuk demonstrasi sahaja.
Work with sample data sets and dashboards to learn how analysts turn business questions into useful insights. Fictional demo employer.|Gunakan set data contoh dan papan pemuka untuk mempelajari cara penganalisis menghasilkan cerapan berguna daripada persoalan perniagaan. Majikan demo rekaan.
Sample internship assisting with defensive monitoring, security documentation and security awareness activities.|Contoh latihan industri yang membantu pemantauan pertahanan, dokumentasi keselamatan dan aktiviti kesedaran keselamatan.
Contribute user flows, wireframes and prototypes to an imaginary product design studio.|Sumbangkan aliran pengguna, rangka dawai dan prototaip kepada studio reka bentuk produk rekaan.
A sample internship for students interested in modelling, data analysis and financial research.|Contoh latihan industri untuk pelajar yang berminat dalam pemodelan, analisis data dan penyelidikan kewangan.
Illustrative graduate programme with rotational assignments. No real recruitment or contractual terms are asserted.|Contoh program graduan dengan tugasan bergilir. Tiada pengambilan sebenar atau terma kontrak yang disahkan.
A fictional remote internship supporting campaign performance, content and growth experiments.|Latihan industri jarak jauh rekaan bagi menyokong prestasi kempen, kandungan dan eksperimen pertumbuhan.
Illustrative graduate rotational programme. Contract status and intake details are not real.|Contoh program graduan bergilir. Status kontrak dan maklumat pengambilan bukan maklumat sebenar.
Academic achievement|Pencapaian akademik
Leadership|Kepimpinan
Teamwork|Kerja berpasukan
Pitching|Pembentangan idea
Prototyping|Pembinaan prototaip
Networking|Rangkaian
Security|Keselamatan
User Research|Penyelidikan pengguna
Statistics|Statistik
Communication|Komunikasi
Content|Kandungan
Analytics|Analitik
Demo Student|Pelajar demo
Demo|Demo
What is the next value in the series 2, 6, 12, 20, ?|Apakah nilai seterusnya dalam jujukan 2, 6, 12, 20, ?
Which data structure uses First In, First Out?|Struktur data manakah yang menggunakan prinsip masuk dahulu, keluar dahulu (FIFO)?
Stack|Tindanan
Queue|Baris gilir
Tree|Pokok
Graph|Graf
What does SQL stand for?|Apakah kepanjangan SQL?
Which of these is a valid Boolean value?|Manakah antara berikut ialah nilai Boolean yang sah?
Maybe|Mungkin
True|Benar
Later|Kemudian
Integer|Integer
If 4 programmers finish a task in 12 hours, how long would 8 equally productive programmers take?|Jika 4 pengatur cara menyiapkan tugas dalam 12 jam, berapa lamakah masa yang diperlukan oleh 8 pengatur cara dengan produktiviti yang sama?
3 hours|3 jam
6 hours|6 jam
12 hours|12 jam
24 hours|24 jam
What is the binary representation of decimal 10?|Apakah perwakilan binari bagi nombor perpuluhan 10?
Which algorithm typically has O(log n) lookup on a sorted array?|Algoritma manakah yang lazimnya mempunyai carian O(log n) pada tatasusunan yang telah diisih?
Linear search|Carian linear
Bubble sort|Isihan gelembung
Binary search|Carian binari
Insertion sort|Isihan sisipan
Which HTTP method is generally used to retrieve data?|Kaedah HTTP manakah yang lazimnya digunakan untuk mendapatkan data?
A value increases from 80 to 100. What is the percentage increase?|Satu nilai meningkat daripada 80 kepada 100. Berapakah peratus peningkatannya?
Which of these is a version control system?|Manakah antara berikut ialah sistem kawalan versi?
If x = 3, what is 2x² + 1?|Jika x = 3, berapakah nilai 2x² + 1?
Which protocol normally encrypts web traffic?|Protokol manakah yang biasanya menyulitkan trafik web?
In JavaScript, which operator checks both value and type equality?|Dalam JavaScript, pengendali manakah yang menyemak kesamaan nilai dan jenis data?
Which device generally forwards packets between networks?|Peranti manakah yang lazimnya menghantar paket antara rangkaian?
Router|Penghala
Keyboard|Papan kekunci
Monitor|Monitor
Printer|Pencetak
A dataset has values 2, 4, 4, 6, 9. What is its median?|Satu set data mempunyai nilai 2, 4, 4, 6, 9. Berapakah mediannya?
A teammate is struggling to meet a deadline. What is the best first step?|Rakan sepasukan sukar menyiapkan tugas sebelum tarikh akhir. Apakah langkah pertama yang terbaik?
Ignore them|Abaikan mereka
Offer help and discuss blockers|Tawarkan bantuan dan bincangkan halangan
Report them immediately|Laporkan mereka serta-merta
Finish their work without asking|Siapkan kerja mereka tanpa bertanya
You find a mistake in a report you already submitted. What should you do?|Anda menemui kesilapan dalam laporan yang telah dihantar. Apakah tindakan anda?
Hide it|Sembunyikannya
Tell the reviewer and correct it|Maklumkan penyemak dan betulkan kesilapan
Blame the software|Salahkan perisian
Wait until asked|Tunggu sehingga ditanya
Which action shows active listening?|Tindakan manakah menunjukkan pendengaran aktif?
Interrupting|Mencelah
Summarising what the speaker said|Merumuskan perkara yang disampaikan oleh pembicara
Checking your phone|Memeriksa telefon
Changing the subject|Menukar topik
Your priorities change at short notice. How should you respond?|Keutamaan anda berubah secara mendadak. Bagaimanakah anda harus bertindak?
Refuse immediately|Tolak serta-merta
Clarify priorities and adjust the plan|Jelaskan keutamaan dan sesuaikan rancangan
Work on everything randomly|Lakukan semua tugas secara rawak
Stop communicating|Berhenti berkomunikasi
A colleague suggests an idea you disagree with. What is most effective?|Rakan sekerja mencadangkan idea yang anda tidak setujui. Apakah tindakan paling berkesan?
Dismiss it|Ketepikannya
Ask questions and explain your reasoning respectfully|Ajukan soalan dan jelaskan alasan anda dengan hormat
Speak louder|Bercakap dengan lebih kuat
Avoid the person|Elakkan orang tersebut
What is a SMART goal?|Apakah matlamat SMART?
Simple, Major, Ambitious, Rapid, Tough|Mudah, Utama, Bercita-cita tinggi, Pantas, Sukar
Specific, Measurable, Achievable, Relevant, Time-bound|Khusus, Boleh diukur, Boleh dicapai, Relevan, Terikat masa
Short, Memorable, Active, Real, Tactical|Pendek, Mudah diingati, Aktif, Nyata, Taktikal
Strategic, Modern, Accessible, Realistic, Timely|Strategik, Moden, Boleh diakses, Realistik, Tepat pada masanya
An interview question asks about a setback. Which structure helps?|Soalan temu duga meminta anda menceritakan cabaran yang pernah dihadapi. Struktur manakah yang membantu?
You receive unclear instructions from your manager. What should you do?|Anda menerima arahan yang kurang jelas daripada pengurus. Apakah tindakan anda?
Guess everything|Teka semuanya
Ask clarifying questions|Ajukan soalan untuk mendapatkan penjelasan
Do nothing|Tidak berbuat apa-apa
Delegate without discussion|Serahkan tugas tanpa perbincangan
Your teammate takes credit for shared work. What is a productive response?|Rakan sepasukan mengaku hasil kerja bersama sebagai hasilnya sendiri. Apakah respons yang membina?
Publicly insult them|Hina mereka di khalayak ramai
Calmly discuss contributions with evidence|Bincangkan sumbangan dengan tenang berdasarkan bukti
Quit immediately|Berhenti serta-merta
Post accusations online|Siarkan tuduhan dalam talian
What shows professional integrity?|Apakah yang menunjukkan integriti profesional?
Hiding errors|Menyembunyikan kesilapan
Being transparent and accountable|Bersikap telus dan bertanggungjawab
Misrepresenting results|Memalsukan gambaran hasil
Sharing confidential data|Berkongsi data sulit
You are asked to use data you have not been authorised to access. What is best?|Anda diminta menggunakan data yang anda tidak dibenarkan akses. Apakah tindakan terbaik?
Use it anyway|Gunakannya juga
Verify access rights and seek approval|Semak hak akses dan dapatkan kelulusan
Email it to yourself|Hantar data itu ke e-mel sendiri
Share it with peers|Kongsikannya dengan rakan
You have two urgent tasks with the same deadline. What should you do first?|Anda mempunyai dua tugas mendesak dengan tarikh akhir yang sama. Apakah tindakan pertama anda?
Choose randomly|Pilih secara rawak
Discuss priority and constraints|Bincangkan keutamaan dan kekangan
Leave both unfinished|Biarkan kedua-duanya tidak selesai
Skip communication|Abaikan komunikasi
A user reports a product defect. What is the strongest first response?|Pengguna melaporkan kecacatan produk. Apakah respons awal yang terbaik?
Dismiss the complaint|Ketepikan aduan
Acknowledge, gather details and investigate|Akui aduan, kumpulkan butiran dan siasat
Blame the user|Salahkan pengguna
Promise an unverified fix|Janjikan pembaikan yang belum disahkan
How should you handle confidential company information?|Bagaimanakah anda harus mengendalikan maklumat sulit syarikat?
Share it in open chats|Kongsikannya dalam sembang terbuka
Follow access controls and policy|Patuhi kawalan akses dan dasar
Store it on public drives|Simpan dalam pemacu awam
Discuss it publicly|Bincangkannya secara terbuka
A team is falling behind. What can improve coordination?|Pasukan ketinggalan jadual. Apakah yang boleh meningkatkan penyelarasan?
Avoid updates|Elakkan kemas kini
Agree on owners, milestones and check-ins|Sepakati penanggungjawab, pencapaian sasaran dan semakan berkala
Assign blame|Tuding jari
Add untracked tasks|Tambah tugas tanpa penjejakan
Your feedback on a presentation is negative. What should you do?|Anda menerima maklum balas negatif tentang pembentangan. Apakah tindakan anda?
Ignore it|Abaikan maklum balas
Identify actionable changes|Kenal pasti perubahan yang boleh dilaksanakan
Attack the reviewer|Serang penyemak
Stop presenting|Berhenti membuat pembentangan
A teammate is excluded from a discussion. What should you do?|Rakan sepasukan tidak disertakan dalam perbincangan. Apakah tindakan anda?
Continue without them|Teruskan tanpa mereka
Invite their perspective|Jemput mereka berkongsi pandangan
Speak on their behalf|Bercakap bagi pihak mereka
Which behaviour best demonstrates ownership?|Tingkah laku manakah paling menunjukkan rasa tanggungjawab?
Escalating every small issue|Merujuk setiap isu kecil kepada pihak atasan
Following through and reporting progress|Melaksanakan tugas hingga selesai dan melaporkan kemajuan
Avoiding mistakes by doing nothing|Mengelakkan kesilapan dengan tidak berbuat apa-apa
Shifting responsibility|Mengalihkan tanggungjawab
A client requests a feature that is out of scope. What is appropriate?|Pelanggan meminta ciri di luar skop. Apakah tindakan yang sesuai?
Agree without checking|Setuju tanpa menyemak
Discuss scope, timeline and trade-offs|Bincangkan skop, garis masa dan pertimbangan antara pilihan
Promise delivery tomorrow|Janjikan penyerahan esok
How should you prepare for a company interview?|Bagaimanakah anda harus bersedia untuk temu duga syarikat?
Rely on assumptions|Bergantung pada andaian
Research its work and the role|Selidik kegiatan syarikat dan jawatan tersebut
Memorise fake stories|Hafal cerita rekaan
Avoid questions|Elakkan soalan
What should you do when a meeting lacks a clear purpose?|Apakah tindakan anda apabila tujuan mesyuarat tidak jelas?
Leave abruptly|Keluar secara tiba-tiba
Clarify desired outcomes|Jelaskan hasil yang ingin dicapai
Stay silent forever|Terus berdiam diri
Start unrelated topics|Mulakan topik yang tidak berkaitan
A teammate speaks over others repeatedly. What response helps?|Rakan sepasukan kerap mencelah percakapan orang lain. Apakah respons yang membantu?
Insult them|Hina mereka
Set a respectful turn-taking norm|Tetapkan amalan bercakap mengikut giliran dengan hormat
Stop the project|Hentikan projek
Exclude them permanently|Sisihkan mereka secara kekal
You identify a risk that could affect delivery. What should you do?|Anda mengenal pasti risiko yang boleh menjejaskan penyerahan. Apakah tindakan anda?
Wait until it happens|Tunggu sehingga risiko berlaku
Raise it early with mitigation options|Maklumkan lebih awal bersama pilihan mitigasi
Inform only friends|Maklumkan rakan sahaja
Which is the strongest example of constructive feedback?|Manakah contoh maklum balas membina yang terbaik?
This is bad|Ini teruk
The structure is clear; add evidence to support point two|Strukturnya jelas; tambah bukti untuk menyokong isi kedua
You never do anything right|Anda tidak pernah melakukan apa-apa dengan betul
No comment|Tiada komen
How can you manage a skill gap for a task?|Bagaimanakah anda boleh mengatasi kekurangan kemahiran untuk sesuatu tugas?
Pretend you know everything|Berpura-pura mengetahui semuanya
Ask for guidance and plan targeted learning|Minta bimbingan dan rancang pembelajaran bersasar
Quit without notice|Berhenti tanpa notis
Copy unverified work|Salin kerja yang belum disahkan
What is a good reason to ask for a deadline extension?|Apakah alasan yang munasabah untuk memohon lanjutan tempoh?
Because you forgot|Kerana anda terlupa
A documented change in scope and realistic revised plan|Perubahan skop yang didokumenkan dan rancangan baharu yang realistik
Without any explanation|Tanpa sebarang penjelasan
To avoid feedback|Untuk mengelakkan maklum balas
A mistake impacts several colleagues. What should you do?|Satu kesilapan menjejaskan beberapa rakan sekerja. Apakah tindakan anda?
Conceal it|Sembunyikan kesilapan
Inform stakeholders and propose a fix|Maklumkan pihak berkepentingan dan cadangkan pembaikan
Blame someone else|Salahkan orang lain
Erase evidence|Padam bukti
You finish your work early. What is most helpful?|Anda menyiapkan kerja lebih awal. Apakah tindakan paling membantu?
Make up extra results|Reka hasil tambahan
Check quality and help teammates appropriately|Semak kualiti dan bantu rakan sepasukan mengikut kesesuaian
Stop responding|Berhenti memberikan respons
Delete old files|Padam fail lama
Two teammates strongly disagree. What can help?|Dua rakan sepasukan sangat berbeza pendapat. Apakah yang boleh membantu?
Pick a side blindly|Memihak tanpa pertimbangan
Facilitate discussion around facts and goals|Bantu perbincangan berasaskan fakta dan matlamat
Raise your voice|Tinggikan suara
Avoid the issue|Elakkan isu tersebut
An internship offer looks suspicious and requests upfront payment. What should you do?|Tawaran latihan industri kelihatan mencurigakan dan meminta bayaran pendahuluan. Apakah tindakan anda?
Pay quickly|Bayar segera
Verify independently and report concerns|Sahkan secara bebas dan laporkan kebimbangan
Share bank details|Kongsi butiran bank
Encourage friends to pay|Galakkan rakan membayar
Your team is developing a student scholarship portal. Two days before delivery, a teammate discovers that some scholarship deadlines are inaccurate, while another teammate suggests launching anyway. Explain how you would respond, prioritise the work, communicate with stakeholders, and prevent similar issues.|Pasukan anda sedang membangunkan portal biasiswa pelajar. Dua hari sebelum penyerahan, rakan sepasukan mendapati beberapa tarikh tutup biasiswa tidak tepat, manakala seorang lagi mencadangkan pelancaran diteruskan. Jelaskan respons anda, cara menetapkan keutamaan kerja, berkomunikasi dengan pihak berkepentingan dan mencegah isu serupa.
TIMED MOCK ASSESSMENT|PENILAIAN PERCUBAAN BERMASA
Sample practice · Answering a question is final. Switching sections is irreversible.|Latihan contoh · Jawapan yang dihantar adalah muktamad. Anda tidak boleh kembali selepas bertukar bahagian.
Choose an answer to submit|Pilih jawapan untuk dihantar
Answer locked and saved|Jawapan dikunci dan disimpan
Submit written answer|Hantar jawapan bertulis
Explain your reasoning and recommended actions...|Jelaskan alasan dan tindakan yang anda cadangkan...
ASSESSMENT COMPLETE|PENILAIAN SELESAI
Practice results|Keputusan latihan
Your answers were recorded on this browser for this demo.|Jawapan demo anda direkodkan dalam pelayar ini.
Back to tests|Kembali ke ujian
Resume full assessment|Sambung penilaian penuh
STUDENT SPACE|RUANG PELAJAR
My profile|Profil saya
Switch / log out|Tukar peranan / log keluar
Your progress, opportunities, and next steps — all together.|Kemajuan, peluang dan langkah seterusnya anda — semuanya di satu tempat.
Your next step|Langkah seterusnya anda
Keep growing|Terus maju
Explore new opportunities, connect with students, and prepare for your next application.|Terokai peluang baharu, berhubung dengan pelajar dan bersedia untuk permohonan seterusnya.
Explore internships|Terokai latihan industri
Practice an assessment|Cuba penilaian latihan
Your personal shortlist, stored on this browser.|Senarai pilihan peribadi anda, disimpan dalam pelayar ini.
Your personal shortlist, stored in your account.|Senarai pilihan peribadi anda, disimpan dalam akaun anda.
Nothing saved yet|Belum ada peluang disimpan
Bookmark opportunities while browsing.|Simpan peluang yang menarik semasa meneroka.
Discover opportunities|Terokai peluang
EMPLOYER PORTAL|PORTAL MAJIKAN
Manage verification, internship postings and candidates.|Urus pengesahan, iklan latihan industri dan calon.
Submit for admin review|Hantar untuk semakan pentadbir
Demo mode: switch to the demo admin role to review this sample request. This is not real-world identity validation.|Mod demo: tukar kepada peranan pentadbir demo untuk menyemak permohonan contoh ini. Ini bukan pengesahan identiti sebenar.
New internship|Latihan industri baharu
Verification required before publishing|Pengesahan diperlukan sebelum penerbitan
Verified: publishing enabled|Disahkan: penerbitan dibenarkan
University|Universiti
Nonprofit|Organisasi bukan untung
Startup|Syarikat pemula
Firm|Firma
ADMIN WORKSPACE|RUANG KERJA PENTADBIR
Platform oversight|Pemantauan platform
Review employer evidence, manage trust status, and protect students.|Semak bukti majikan, urus status kepercayaan dan lindungi pelajar.
Demonstration administrator: this review is entirely simulated and does not confer real verification.|Pentadbir demonstrasi: semakan ini ialah simulasi sepenuhnya dan tidak memberikan pengesahan sebenar.
No pending reviews|Tiada semakan tertangguh
New verification requests will appear here.|Permohonan pengesahan baharu akan dipaparkan di sini.
To demonstrate the full workflow: switch to Employer, submit a verification request, switch to Admin and approve, then switch back to Employer and publish.|Untuk mencuba aliran kerja penuh: tukar kepada Majikan, hantar permohonan pengesahan, tukar kepada Pentadbir dan luluskan, kemudian tukar semula kepada Majikan untuk menerbitkan peluang.
Requests are reviewed by an authorized admin. Approved status is controlled by backend policies.|Permohonan disemak oleh pentadbir yang diberi kuasa. Status kelulusan dikawal oleh dasar sistem.
Live administrative actions are enforced by database role checks and recorded in an audit log.|Tindakan pentadbiran sebenar dikawal melalui semakan peranan pangkalan data dan direkodkan dalam log audit.
ADMINISTRATION|PENTADBIRAN
Restricted area|Kawasan terhad
Only authorized administrators can review and approve organizations.|Hanya pentadbir yang diberi kuasa boleh menyemak dan meluluskan organisasi.
Administrator access required|Akses pentadbir diperlukan
Use the demo role switcher to explore a sample approval workflow.|Gunakan penukar peranan demo untuk meneroka contoh aliran kelulusan.
Open demo login|Buka log masuk demo
No registration provided|Tiada nombor pendaftaran diberikan
Review organization profile|Semak profil organisasi
Sample evidence submitted by demo employer|Bukti contoh dihantar oleh majikan demo
pending|menunggu semakan
approved|diluluskan
rejected|ditolak
unverified|belum disahkan
Under Review|Dalam semakan
Interview|Temu duga
Offered|Tawaran diberikan
Change application status|Tukar status permohonan
Demo only|Demo sahaja
Build your future with us.|Bina masa hadapan anda bersama kami.
Discover opportunities, save your favourites, and keep moving forward.|Terokai peluang, simpan pilihan kegemaran dan terus maju.
Create account|Cipta akaun
Your full name|Nama penuh anda
Minimum 6 characters|Minimum 6 aksara
New here?|Pengguna baharu?
Already registered?|Sudah berdaftar?
Account created. Check your email to confirm your address.|Akaun dicipta. Semak e-mel anda untuk mengesahkan alamat e-mel.
Application status updated|Status permohonan dikemas kini
Application submitted securely|Permohonan dihantar dengan selamat
Application withdrawn|Permohonan ditarik balik
CV must be a PDF under 5MB|CV mestilah fail PDF bersaiz kurang daripada 5MB
Employer account required|Akaun majikan diperlukan
Employer must be approved first|Majikan mesti diluluskan terlebih dahulu
Evidence must be under 5MB|Bukti mestilah bersaiz kurang daripada 5MB
Live application unavailable in demo mode|Permohonan sebenar tidak tersedia dalam mod demo
No document URL received|Tiada URL dokumen diterima
No supporting document uploaded|Tiada dokumen sokongan dimuat naik
Not verified|Belum disahkan
Only students can apply|Hanya pelajar boleh memohon
Please enter a meaningful case response (at least 30 characters)|Sila masukkan respons kajian kes yang bermakna (sekurang-kurangnya 30 aksara)
Reporting requires the live backend|Pelaporan memerlukan sistem sebenar
Save the organization profile first|Simpan profil organisasi terlebih dahulu
This is only a sample vacancy|Ini hanyalah kekosongan contoh
Use a PDF, PNG or JPEG file|Gunakan fail PDF, PNG atau JPEG
Voice calls need a real-time voice provider. Text chat is available in this demo.|Panggilan suara memerlukan penyedia perkhidmatan suara masa nyata. Sembang teks tersedia dalam demo ini.
You have already applied|Anda telah memohon
Explain your organization's identity, official domain and evidence...|Terangkan identiti organisasi, domain rasmi dan bukti sokongan...
A sample infrastructure internship covering monitoring, basic configuration and troubleshooting.|Contoh latihan industri infrastruktur yang merangkumi pemantauan, konfigurasi asas dan penyelesaian masalah.
Diploma & Degree|Diploma & ijazah
Telecommunications|Telekomunikasi
Technical workshop introducing AI agents and small prototype workflows. Demo event; date and registration are not real.|Bengkel teknikal yang memperkenalkan ejen AI dan aliran kerja prototaip kecil. Acara demo; tarikh dan pendaftaran bukan maklumat sebenar.
OPPORTUNITY|PELUANG
Listing not found|Peluang tidak ditemui
This opportunity may have been removed.|Peluang ini mungkin telah dipadamkan.
Refer to official provider|Rujuk penyedia rasmi
Submit your application. Your résumé will be stored privately for the employer to review.|Hantar permohonan anda. Resume anda disimpan secara peribadi untuk semakan majikan.
This is a sample listing. You can save it but cannot send an application to a fictional employer.|Ini ialah senarai contoh. Anda boleh menyimpannya tetapi tidak boleh menghantar permohonan kepada majikan rekaan.
Big dreams.|Impian besar.
Real|Sebenar
opportunities.|peluang.
All in one place.|Semuanya di satu tempat.
From your first scholarship to your dream internship. Discover opportunities, connect with students and mentors, and turn potential into progress.|Daripada biasiswa pertama hingga latihan industri impian anda. Terokai peluang, berhubung dengan pelajar dan mentor, serta realisasikan potensi anda.
Trending:|Popular:
Built around the student journey|Dibina berasaskan perjalanan pelajar
Explore · Prepare · Connect · Grow|Teroka · Bersedia · Berhubung · Maju
my scholarku dashboard|papan pemuka Scholarku saya
YOUR OPPORTUNITY HUB ✨|HAB PELUANG ANDA ✨
Ready for what's|Bersedia untuk langkah
next?|seterusnya?
Opportunity categories|Kategori peluang
Connected journey|Perjalanan yang bersepadu
EXPLORE WHAT'S POSSIBLE|TEROKAI KEMUNGKINAN
Find your scholarship|Cari biasiswa anda
Funding and financial aid|Pembiayaan dan bantuan kewangan
Grow with hands-on experience|Maju melalui pengalaman praktikal
Join a hackathon|Sertai hackathon
Build, compete and connect|Bina, bersaing dan berhubung
One connected journey|Satu perjalanan yang bersepadu
Your growth starts here|Kemajuan anda bermula di sini
Achievement unlocked!|Pencapaian baharu!
Celebrate every milestone|Raikan setiap pencapaian
BETTER, TOGETHER|LEBIH BAIK BERSAMA
Find your people.|Temui komuniti anda.
Grow your circle.|Luaskan jaringan anda.
Join students who share your interests. Celebrate competition wins, share your projects, ask questions, and learn from each other in dedicated community channels.|Sertai pelajar yang berkongsi minat anda. Raikan kemenangan pertandingan, kongsi projek, ajukan soalan dan belajar bersama melalui saluran komuniti khusus.
Build together|Bina bersama
Help each other|Saling membantu
Stay curious|Terus meneroka
Share your work|Kongsi hasil kerja anda
Anyone joining the hackathon this weekend? 👋|Ada sesiapa menyertai hackathon hujung minggu ini? 👋
Me! I'm looking for a teammate who knows Python.|Saya! Saya sedang mencari rakan sepasukan yang mahir Python.
Let's build something awesome together! 🚀|Mari bina sesuatu yang hebat bersama! 🚀
PRACTICE MAKES PROGRESS|LATIHAN MEMBAWA KEMAJUAN
Prep today. Stand out tomorrow.|Bersedia hari ini. Menyerlah esok.
Get familiar with aptitude questions, coding challenges, HR assessments and situational judgement practice — before the real assessment.|Biasakan diri dengan soalan aptitud, cabaran pengaturcaraan, penilaian sumber manusia dan latihan penilaian situasi sebelum penilaian sebenar.
Find an opportunity that fits your ambitions.|Cari peluang yang sepadan dengan cita-cita anda.
Prepare & connect|Bersedia & berhubung
Practice, meet peers, and learn from mentors.|Berlatih, temui rakan sebaya dan belajar daripada mentor.
Take your next step|Mulakan langkah seterusnya
Apply with confidence and track your progress.|Mohon dengan yakin dan jejaki kemajuan anda.
Search opportunities|Cari peluang
Search scholarships, internships, events...|Cari biasiswa, latihan industri, acara...
Community message|Mesej komuniti
Practice planning an AI assistant workflow and creating a basic agent prototype. Sample workshop, not an announced public event.|Berlatih merancang aliran kerja pembantu AI dan membina prototaip ejen asas. Bengkel contoh, bukan acara awam yang diumumkan.
A fictional example of financial assistance for Malaysian students with leadership potential.|Contoh rekaan bantuan kewangan untuk pelajar Malaysia yang berpotensi dalam kepimpinan.
A fictional data visualization and insight challenge for teams.|Cabaran rekaan visualisasi data dan cerapan untuk pasukan.
A fictional beginner workshop on Linux, forensics and puzzle-based cyber security.|Bengkel rekaan untuk pemula tentang Linux, forensik dan keselamatan siber berasaskan teka-teki.
2026 application period closed 25 April 2026; full scholarship, subject to eligibility.|Tempoh permohonan 2026 ditutup pada 25 April 2026; biasiswa penuh, tertakluk kepada kelayakan.
Foundation website; find current scholarship intake and eligibility.|Laman yayasan; semak pengambilan biasiswa dan kelayakan terkini.
Official foundation website; confirm current PPBU intake.|Laman rasmi yayasan; sahkan pengambilan PPBU terkini.
Official sponsorship portal; check PIDN and other schemes.|Portal penajaan rasmi; semak PIDN dan skim lain.
Foundation website; current intake not confirmed.|Laman yayasan; pengambilan terkini belum disahkan.
Official Malaysia bank website; scholarship intake not confirmed.|Laman rasmi bank di Malaysia; pengambilan biasiswa belum disahkan.
Official bank website; specific scholarship programme not confirmed.|Laman rasmi bank; program biasiswa khusus belum disahkan.
`;
const dictionary=Object.fromEntries(catalogue.trim().split('\n').map(line=>line.split('|')));
let language=localStorage.getItem('sk-language')==='bm'?'bm':'en';
const originals=new WeakMap();
function text(value){if(language!=='bm')return value;const trimmed=value.trim();let translated=dictionary[trimmed];if(!translated){translated=trimmed.replace(/(\d[\d.,k]*) demo members/g,'$1 ahli demo').replace(/(\d+) questions?/g,'$1 soalan').replace(/(\d+) min\b/g,'$1 minit').replace(/^Section (\d+) of (\d+)$/,'Bahagian $1 daripada $2').replace(/^Question (\d+) of (\d+)$/,'Soalan $1 daripada $2').replace(/^(\d+) of (\d+) submitted$/,'$1 daripada $2 dihantar').replace(/^Hi, (.+) 👋$/,'Hai, $1 👋').replace(/^Welcome, (.+)$/,'Selamat datang, $1').replace(/^Verification (.+)$/,(_,status)=>'Pengesahan '+(dictionary[status]||status)).replace(/^Switched to (.+) demonstration role$/,(_,role)=>'Beralih kepada peranan demo '+({student:'pelajar',employer:'majikan',admin:'pentadbir'}[role]||role)).replace(/^Apply to (.+)$/,(_,title)=>'Mohon '+(dictionary[title]||title)).replace(/^Reason for (approve|reject) decision \(recorded in the audit trail\):$/,(_,decision)=>'Sebab keputusan '+(decision==='approve'?'kelulusan':'penolakan')+' (direkodkan dalam jejak audit):').replace(/^Welcome to #([^!]+)! This is a demo student channel\. Share useful tips, ask questions and be kind\.$/,'Selamat datang ke #$1! Ini ialah saluran pelajar demo. Kongsi tip berguna, ajukan soalan dan hormati satu sama lain.')}if(translated===trimmed&&trimmed.includes(' · '))translated=trimmed.split(' · ').map(x=>dictionary[x]||x).join(' · ');return value.replace(trimmed,translated||trimmed)}
function translate(root=document.body){if(!root)return;document.documentElement.lang=language==='bm'?'ms':'en';root.querySelectorAll('option:not([value])').forEach(el=>el.value=el.textContent);const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('script,style,code,textarea,[data-no-translate]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});let n;while(n=walker.nextNode()){const previous=originals.get(n);const source=previous&&n.nodeValue===previous.rendered?previous.source:n.nodeValue;const rendered=text(source);if(n.nodeValue!==rendered)n.nodeValue=rendered;originals.set(n,{source,rendered})}root.querySelectorAll('[placeholder],[aria-label],[title],option').forEach(el=>{if(el.matches('option')&&!el.hasAttribute('value'))el.value=el.textContent;for(const attr of ['placeholder','aria-label','title']){if(!el.hasAttribute(attr))continue;const key='data-i18n-'+attr;const current=el.getAttribute(attr);const source=el.getAttribute(key)||current;el.setAttribute(key,source);const translated=text(source);if(current!==translated)el.setAttribute(attr,translated)}})}
window.ScholarkuI18n={get language(){return language},toggle(){language=language==='en'?'bm':'en';localStorage.setItem('sk-language',language)},translate,text,dictionary};
// Notifications can change without a page render.
const toast=document.getElementById('toast');if(toast)new MutationObserver(()=>translate(toast)).observe(toast,{childList:true,subtree:true});
})();
