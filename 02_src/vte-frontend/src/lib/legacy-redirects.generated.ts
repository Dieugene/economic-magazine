// СГЕНЕРИРОВАНО скриптом scripts/legacy-redirects/generate.mjs — правки вносить туда.
//
// Адреса старого сайта журнала, на которые указывают зарегистрированные DOI статей.
// После переезда на Next.js они отдают 404, а вместе с ними мертвы и DOI-ссылки в чужих
// публикациях, поисковиках и библиографиях. Каждому адресу сопоставлена страница статьи
// на новом сайте — сопоставление точное, по DOI.
//
// Адреса PDF (/files/...) сейчас до приложения не доходят: их обслуживает nginx и сам отдаёт
// 404. Правила для них лежат здесь заранее — они начнут работать, как только nginx перестанет
// перехватывать эти запросы, и не потребуют отдельного релиза.

export interface LegacyRedirect {
  source: string;
  destination: string;
}

export const legacyRedirects: LegacyRedirect[] = [
  // 10.52342/2587-7666vte_2025_4_7_19
  { source: "/index.php/arkhiv-publikatsij/2025/21-stati/ekonomicheskaya-teoriya/72-soboleva-i-v-chernykh-e-a-blagopoluchie-svyazannoe-s-rabotoj-kontseptsiya-i-metodologicheskie-podkhody-k-izmereniyu/", destination: "/article/185/" },
  // 10.52342/2587-7666vte_2025_4_20_35
  { source: "/index.php/arkhiv-publikatsij/2025/21-stati/ekonomicheskaya-teoriya/73-volchik-v-v-kot-v-v-reformy-faktor-ideologii-v-svete-rossijskikh-nauchnykh-publikatsij/", destination: "/article/188/" },
  // 10.52342/2587-7666vte_2025_4_36_52
  { source: "/index.php/arkhiv-publikatsij/2025/22-stati/metodologiya-ekonomicheskoj-nauki/74-tambovtsev-v-l-nuzhna-li-novomu-mirovomu-ekonomicheskomu-poryadku-novaya-ekonomicheskaya-teoriya/", destination: "/article/194/" },
  // 10.52342/2587-7666vte_2025_4_53_67
  { source: "/index.php/arkhiv-publikatsij/2025/22-stati/metodologiya-ekonomicheskoj-nauki/75-levin-s-n-sablin-k-s-konkuriruyushchie-paradigmy-v-ramkakh-sovremennoj-politicheskoj-ekonomii/", destination: "/article/195/" },
  // 10.52342/2587-7666vte_2025_4_68_90
  { source: "/index.php/arkhiv-publikatsij/2025/23-stati/ot-teorii-k-ekonomicheskoj-politike/76-shcherbakov-v-s-otsenka-inflyatsionnykh-ozhidanij-naseleniya-rossii-na-osnove-poiskovykh-zaprosov-v-seti-internet-podkhod-sverkhu-vniz/", destination: "/article/196/" },
  // 10.52342/2587-7666vte_2025_4_91_104
  { source: "/index.php/arkhiv-publikatsij/2025/24-stati/istoriya-mysli/77-gloveli-g-d-merzlikin-k-e-r-m-nureev-ot-politekonomii-v-shirokom-smysle-k-poisku-institutsionalnoj-bolshoj-teorii-ekonomicheskoj-istorii/", destination: "/article/197/" },
  // 10.52342/2587-7666vte_2025_4_105_116
  { source: "/index.php/arkhiv-publikatsij/2025/2-uncategorised/78-maslov-g-a-issledovanie-ntp-i-teorij-tekhniko-ekonomicheskogo-razvitiya-v-rabotakh-yu-ya-olsevicha/", destination: "/article/198/" },
  // 10.52342/2587-7666vte_2025_4_117_132
  { source: "/index.php/arkhiv-publikatsij/2025/24-stati/istoriya-mysli/79-borokh-o-n-transformatsiya-sistemy-ekonomicheskogo-obrazovaniya-v-kitae-pervaya-polovina-1950-kh-godov/", destination: "/article/199/" },
  // 10.52342/2587-7666vte_2025_4_133_143
  { source: "/index.php/arkhiv-publikatsij/2025/25-stati/mezhdistsiplinarnye-issledovaniya/80-kazun-a-p-i-doverie-i-zakon-kak-sotsialnyj-kapital-i-formalnye-instituty-vliyayut-na-soblyudenie-kovidnykh-ogranichenij/", destination: "/article/200/" },
  // 10.52342/2587-7666vte_2025_4_144_157
  { source: "/index.php/arkhiv-publikatsij/2025/25-stati/mezhdistsiplinarnye-issledovaniya/81-titov-v-n-loginov-d-m-vliyanie-sotsialnogo-kapitala-na-subektivnoe-blagopoluchie/", destination: "/article/201/" },
  // 10.52342/2587-7666vte_2025_4_158_179
  { source: "/index.php/arkhiv-publikatsij/2025/26-stati/ekonomicheskaya-istoriya/82-vasilev-s-a-ekonomicheskie-reformy-v-rossii-90-kh-gg-formirovanie-komandy-i-ideologii-reformatorov/", destination: "/article/202/" },
  // 10.52342/2587-7666vte_2025_4_180_190
  { source: "/index.php/arkhiv-publikatsij/2025/27-stati/obzory-i-retsenzii/83-pliskevich-n-m-rossijskoe-obshchestvo-i-vyzovy-vremeni-desyatiletie-2014-2024-gg-novoe-issledovanie-instituta-sotsiologii-ran/", destination: "/article/203/" },
  // 10.52342/2587-7666vte_2026_1_7_21
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/89-rubinshtejn-a-ya-chukovskaya-e-e-nauchnaya-deyatelnost-v-tsifrovuyu-epokhu-proizvodstvo-i-rasprostranenie-znaniya/", destination: "/article/118/" },
  // 10.52342/2587-7666vte_2026_1_22_38
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/90-komarovskaya-n-v-neopredeljonnost-i-ekonomicheskaya-aktivnost-teoreticheskie-aspekty/", destination: "/article/154/" },
  // 10.52342/2587-7666vte_2026_1_39_53
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/91-kapultsevich-i-k-kulturnaya-transformatsiya-kak-obekt-institutsionalnogo-proektirovaniya-teoreticheskie-osnovy-i-empiricheskie-vozmozhnosti-c-nudge-modelirovaniya/", destination: "/article/155/" },
  // 10.52342/2587-7666vte_2026_1_54_69
  { source: "/index.php/22-stati/metodologiya-ekonomicheskoj-nauki/92-tishkin-a-s-naukovedcheskie-podkhody-t-kuna-i-i-lakatosa-v-metodologii-ekonomicheskoj-nauki-i-ikh-kritika/", destination: "/article/156/" },
  // 10.52342/2587-7666vte_2026_1_70_91
  { source: "/index.php/23-stati/ot-teorii-k-ekonomicheskoj-politike/93-yanovskij-k-e-zhavoronkov-s-v-zatkovetskij-i-pensii-ot-gosudarstva-polza-ne-ochevidna-vred-ocheviden/", destination: "/article/157/" },
  // 10.52342/2587-7666vte_2026_1_92_111
  { source: "/index.php/23-stati/ot-teorii-k-ekonomicheskoj-politike/94-dmitriev-m-e-okonishnikov-a-a-semenyaka-a-n-tselevoj-zhilishchnyj-kapital-sotsialno-orientirovannyj-institutsionalnyj-dizajn/", destination: "/article/158/" },
  // 10.52342/2587-7666vte_2026_1_112_127
  { source: "/index.php/23-stati/ot-teorii-k-ekonomicheskoj-politike/95-bykovskij-k-f-kartashev-d-d-obrazovanie-i-dokhod-paradoksy-globalizatsii/", destination: "/article/159/" },
  // 10.52342/2587-7666vte_2026_1_128_144
  { source: "/index.php/24-stati/istoriya-mysli/96-borokh-o-n-kitajskoe-ekonomicheskoe-obrazovanie-v-period-kampanij-kritiki-vtoroj-poloviny-1950-kh-gg/", destination: "/article/160/" },
  // 10.52342/2587-7666vte_2026_1_145_163
  { source: "/index.php/25-stati/mezhdistsiplinarnye-issledovaniya/97-medushevskij-a-n-dobrodetel-i-porok-eticheskie-kodeksy-marginalnykh-soobshchestv-sovremennoj-rossii-chast-1/", destination: "/article/181/" },
  // 10.52342/2587-7666vte_2026_1_164_188
  { source: "/index.php/25-stati/mezhdistsiplinarnye-issledovaniya/98-nisnevich-yu-a-mir-demokraticheskogo-pravleniya-v-nachale-xxi-veka/", destination: "/article/182/" },
  // 10.52342/2587-7666vte_2026_1_189_214
  { source: "/index.php/26-stati/ekonomicheskaya-istoriya/99-vasilev-s-a-programmy-reformirovaniya-ekonomiki-i-zapusk-ekonomicheskikh-reform-v-rossii/", destination: "/article/183/" },
  // 10.52342/2587-7666vte_2026_1_215_227
  { source: "/index.php/27-stati/obzory-i-retsenzii/100-kislitsyna-o-a-iskusstvennyj-intellekt-v-zdravookhranenii-lekarstvo-ili-yad/", destination: "/article/184/" },
  // 10.52342/2587-7666vte_2026_2_7_25
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/102-rubinshtejn-a-ya-chukovskaya-e-e-rasprostranenie-znaniya-i-nauchnye-zhurnaly-v-zerkale-sotsiologicheskogo-issledovaniya/", destination: "/article/90/" },
  // 10.52342/2587-7666vte_2026_2_26_45
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/103-zaostrovtsev-a-p-krakh-liberalnoj-modernizatsii-i-vyzov-russkoj-matritsy/", destination: "/article/91/" },
  // 10.52342/2587-7666vte_2026_2_46_67
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/104-plushchevskaya-yu-l-volny-kondrateva-kak-fazy-sistemnykh-tsiklov-nakopleniya-d-arrigi-teoreticheskie-osnovy-i-empiricheskaya-verifikatsiya/", destination: "/article/108/" },
  // 10.52342/2587-7666vte_2026_2_68_85
  { source: "/index.php/21-stati/ekonomicheskaya-teoriya/105-pliskevich-n-m-kontseptualnoe-prostranstvo-issledovaniya-transformatsionnykh-protsessov/", destination: "/article/109/" },
  // 10.52342/2587-7666vte_2026_2_86_98
  { source: "/index.php/22-stati/metodologiya-ekonomicheskoj-nauki/106-tambovtsev-v-l-preodolenie-ekonomicheskogo-neravenstva-vse-li-voprosy-postavleny/", destination: "/article/110/" },
  // 10.52342/2587-7666vte_2026_2_99_113
  { source: "/index.php/23-stati/ot-teorii-k-ekonomicheskoj-politike/107-shestakova-e-e-est-li-perspektivy-u-dobrovolnogo-meditsinskogo-strakhovaniya-ili-eto-put-v-tupik/", destination: "/article/111/" },
  // 10.52342/2587-7666vte_2026_2_114_134
  { source: "/index.php/23-stati/ot-teorii-k-ekonomicheskoj-politike/108-bondarev-i-m-tekhnologicheskij-suverenitet-kak-pole-konsensusa-rossijskoj-nauki-gosudarstva-i-biznesa-teoreticheskie-aspekty/", destination: "/article/112/" },
  // 10.52342/2587-7666vte_2026_2_135_145
  { source: "/index.php/24-stati/istoriya-mysli/109-rozanova-n-m-filosofiya-ekosistemy-cheloveka-i-prirody-v-rabotakh-s-n-bulgakova/", destination: "/article/113/" },
  // 10.52342/2587-7666vte_2026_2_146_164
  { source: "/index.php/25-stati/mezhdistsiplinarnye-issledovaniya/110-medushevskij-a-n-dobrodetel-i-porok-eticheskie-kodeksy-marginalnykh-soobshchestv-sovremennoj-rossii-chast-2/", destination: "/article/114/" },
  // 10.52342/2587-7666vte_2026_2_165_193
  { source: "/index.php/26-stati/ekonomicheskaya-istoriya/111-vasilev-s-a-popytki-stabilizatsii-rossijskoj-ekonomiki-v-1993-1998-gg-pyat-pravitelstv-viktora-chernomyrdina/", destination: "/article/115/" },
  // 10.52342/2587-7666vte_2026_2_194_208
  { source: "/index.php/26-stati/ekonomicheskaya-istoriya/112-feldman-m-a-vtoroj-pyatiletnij-plan-i-ego-realizatsiya-v-1933-1937-gg-mnogolikaya-sudba/", destination: "/article/116/" },
  // 10.52342/2587-7666vte_2026_2_209_228
  { source: "/index.php/27-stati/obzory-i-retsenzii/113-samojlov-o-m-tatarko-a-n-sotsialno-psikhologicheskie-faktory-doveriya-iskusstvennomu-intellektu-sostoyanie-issledovanij/", destination: "/article/117/" },
  // 10.52342/2587-7666vte_2023_2_7_21
  { source: "/files/arch/2023/2023-N2/Varkhotov_VTE_2023_2.pdf", destination: "/article/318/" },
  // 10.52342/2587-7666vte_2023_2_22_34
  { source: "/files/arch/2023/2023-N2/Tambovtsev_VTE_2023_2.pdf", destination: "/article/319/" },
  // 10.52342/2587-7666vte_2023_2_35_51
  { source: "/files/arch/2023/2023-N2/Klyachko_VTE_2023_2.pdf", destination: "/article/320/" },
  // 10.52342/2587-7666vte_2023_2_52_63
  { source: "/files/arch/2023/2023-N2/Odintsova_VTE_2023_2.pdf", destination: "/article/321/" },
  // 10.52342/2587-7666vte_2023_2_64_84
  { source: "/files/arch/2023/2023-N2/Gloveli_VTE_2023_2.pdf", destination: "/article/322/" },
  // 10.52342/2587-7666vte_2023_2_85_98
  { source: "/files/arch/2023/2023-N2/Medushevsky_VTE_2023_2.pdf", destination: "/article/323/" },
  // 10.52342/2587-7666vte_2023_2_99_117
  { source: "/files/arch/2023/2023-N2/Tikhonova_VTE_2023_2.pdf", destination: "/article/324/" },
  // 10.52342/2587-7666vte_2023_2_118_132
  { source: "/files/arch/2023/2023-N2/Latov_VTE_2023_2.pdf", destination: "/article/325/" },
  // 10.52342/2587-7666vte_2023_2_133_155
  { source: "/files/arch/2023/2023-N2/Melnik_Kholdevich_VTE_2023_2.pdf", destination: "/article/326/" },
  // 10.52342/2587-7666vte_2023_2_156_173
  { source: "/files/arch/2023/2023-N2/Ermolov_VTE_2023_2.pdf", destination: "/article/327/" },
  // 10.52342/2587-7666vte_2023_2_174_183
  { source: "/files/arch/2023/2023-N2/Orekhovsky_VTE_2023_2.pdf", destination: "/article/328/" },
  // 10.52342/2587-7666vte_2023_3_7_21
  { source: "/files/arch/2023/2023-N3/Zaostrovtsev_VTE_2023_3.pdf", destination: "/article/329/" },
  // 10.52342/2587-7666vte_2023_3_22_34
  { source: "/files/arch/2023/2023-N3/Nikolaev_VTE_2023_3.pdf", destination: "/article/330/" },
  // 10.52342/2587-7666vte_2023_3_35_48
  { source: "/files/arch/2023/2023-N3/Libman_VTE_2023_3.pdf", destination: "/article/331/" },
  // 10.52342/2587-7666vte_2023_3_49_61
  { source: "/files/arch/2023/2023-N3/Varkhotov_VTE_2023_3.pdf", destination: "/article/332/" },
  // 10.52342/2587-7666vte_2023_3_62_79
  { source: "/files/arch/2023/2023-N3/Novikova_Zafarjonova_VTE_2023_3.pdf", destination: "/article/333/" },
  // 10.52342/2587-7666vte_2023_3_80_91
  { source: "/files/arch/2023/2023-N3/Markova_VTE_2023_3.pdf", destination: "/article/334/" },
  // 10.52342/2587-7666vte_2023_3_92_107
  { source: "/files/arch/2023/2023-N3/Medushevskiy_VTE_2023_3.pdf", destination: "/article/335/" },
  // 10.52342/2587-7666vte_2023_3_108_126
  { source: "/files/arch/2023/2023-N3/Rimskiy_VTE_2023_3.pdf", destination: "/article/336/" },
  // 10.52342/2587-7666vte_2023_3_127_146
  { source: "/files/arch/2023/2023-N3/Baskakova_VTE_2023_3.pdf", destination: "/article/337/" },
  // 10.52342/2587-7666vte_2023_3_147_156
  { source: "/files/arch/2023/2023-N3/Stepanov_VTE_2023_3.pdf", destination: "/article/338/" },
  // 10.52342/2587-7666vte_2023_3_157_170
  { source: "/files/arch/2023/2023-N3/Balatsky_VTE_2023_3.pdf", destination: "/article/339/" },
  // 10.52342/2587-7666vte_2023_3_171_177
  { source: "/files/arch/2023/2023-N3/Feldman_VTE_2023_3.pdf", destination: "/article/340/" },
  // 10.52342/2587-7666vte_2023_4_7_21
  { source: "/files/arch/2023/2023-N4/Yurevich_VTE_2023_4.pdf", destination: "/article/341/" },
  // 10.52342/2587-7666vte_2023_4_22_40
  { source: "/files/arch/2023/2023-N4/Yanovskiy_VTE_2023_4.pdf", destination: "/article/342/" },
  // 10.52342/2587-7666vte_2023_4_41_52
  { source: "/files/arch/2023/2023-N4/Tambovtsev_VTE_2023_4.pdf", destination: "/article/343/" },
  // 10.52342/2587-7666vte_2023_4_53_67
  { source: "/files/arch/2023/2023-N4/Volchik_VTE_2023_4.pdf", destination: "/article/344/" },
  // 10.52342/2587-7666vte_2023_4_68_92
  { source: "/files/arch/2023/2023-N4/Dmitriev_VTE_2023_4.pdf", destination: "/article/345/" },
  // 10.52342/2587-7666vte_2023_4_93_114
  { source: "/files/arch/2023/2023-N4/Dozhdikov_VTE_2023_4.pdf", destination: "/article/346/" },
  // 10.52342/2587-7666vte_2023_4_115_136
  { source: "/files/arch/2023/2023-N4/Borokh_VTE_2023_4.pdf", destination: "/article/347/" },
  // 10.52342/2587-7666vte_2023_4_137_154
  { source: "/files/arch/2023/2023-N4/Orekhovsky_VTE_2023_4.pdf", destination: "/article/348/" },
  // 10.52342/2587-7666vte_2023_4_155_173
  { source: "/files/arch/2023/2023-N4/Mukhanova_VTE_2023_4.pdf", destination: "/article/349/" },
  // 10.52342/2587-7666vte_2023_4_174_181
  { source: "/files/arch/2023/2023-N4/Stepanov_VTE_2023_4.pdf", destination: "/article/350/" },
  // 10.52342/2587-7666vte_2023_4_182_190
  { source: "/files/arch/2023/2023-N4/Balatsky_VTE_2023_4.pdf", destination: "/article/351/" },
  // 10.52342/2587-7666vte_2024_1_7_21
  { source: "/files/arch/2024/2024-N1/Balatsky_VTE_2024_1.pdf", destination: "/article/301/" },
  // 10.52342/2587-7666vte_2024_1_34_47
  { source: "/files/arch/2024/2024-N1/Zubarevich_VTE_2024_1.pdf", destination: "/article/303/" },
  // 10.52342/2587-7666vte_2024_1_48_64
  { source: "/files/arch/2024/2024-N1/Maltsev_VTE_2024_1.pdf", destination: "/article/304/" },
  // 10.52342/2587-7666vte_2024_1_65_78
  { source: "/files/arch/2024/2024-N1/Shestakova_VTE_2024_1.pdf", destination: "/article/305/" },
  // 10.52342/2587-7666vte_2024_1_79_95
  { source: "/files/arch/2024/2024-N1/Zhavoronkov_VTE_2024_1.pdf", destination: "/article/306/" },
  // 10.52342/2587-7666vte_2024_1_96_105
  { source: "/files/arch/2024/2024-N1/Avtonomov_VTE_2024_1.pdf", destination: "/article/307/" },
  // 10.52342/2587-7666vte_2024_1_106_120
  { source: "/files/arch/2024/2024-N1/Orekhovsky_VTE_2024_1.pdf", destination: "/article/308/" },
  // 10.52342/2587-7666vte_2024_1_121_141
  { source: "/files/arch/2024/2024-N1/Nisnevich_VTE_2024_1.pdf", destination: "/article/314/" },
  // 10.52342/2587-7666vte_2024_1_142_153
  { source: "/files/arch/2024/2024-N1/Kushniruk_VTE_2024_1.pdf", destination: "/article/315/" },
  // 10.52342/2587-7666vte_2024_1_154_164
  { source: "/files/arch/2024/2024-N1/Feldman_VTE_2024_1.pdf", destination: "/article/316/" },
  // 10.52342/2587-7666vte_2024_1_165_179
  { source: "/files/arch/2024/2024-N1/Pliskevich_VTE_2024_1.pdf", destination: "/article/317/" },
  // 10.52342/2587-7666vte_2024_2_7_18
  { source: "/files/arch/2024/2024-N2/Libman_VTE_2024_2.pdf", destination: "/article/276/" },
  // 10.52342/2587-7666vte_2024_2_19_29
  { source: "/files/arch/2024/2024-N2/Tsedilin_VTE_2024_2.pdf", destination: "/article/277/" },
  // 10.52342/2587-7666vte_2024_2_30_44
  { source: "/files/arch/2024/2024-N2/Belyakov_VTE_2024_2.pdf", destination: "/article/286/" },
  // 10.52342/2587-7666vte_2024_2_45_55
  { source: "/files/arch/2024/2024-N2/Tambovtsev_VTE_2024_2.pdf", destination: "/article/287/" },
  // 10.52342/2587-7666vte_2024_2_56_72
  { source: "/files/arch/2024/2024-N2/Shastitko_Morosanova_VTE_2024_2.pdf", destination: "/article/288/" },
  // 10.52342/2587-7666vte_2024_2_73_85
  { source: "/files/arch/2024/2024-N2/Sherbakov_Gartvich_VTE_2024_2.pdf", destination: "/article/289/" },
  // 10.52342/2587-7666vte_2024_2_86_102
  { source: "/files/arch/2024/2024-N2/Gloveli_Zaytseva_Minaeva_VTE_2024_2.pdf", destination: "/article/295/" },
  // 10.52342/2587-7666vte_2024_2_103_115
  { source: "/files/arch/2024/2024-N2/Antipina_Khomutov_VTE_2024_2.pdf", destination: "/article/296/" },
  // 10.52342/2587-7666vte_2024_2_116_133
  { source: "/files/arch/2024/2024-N2/Musikhin_VTE_2024_2.pdf", destination: "/article/297/" },
  // 10.52342/2587-7666vte_2024_2_134_151
  { source: "/files/arch/2024/2024-N2/Baskakova_VTE_2024_2.pdf", destination: "/article/298/" },
  // 10.52342/2587-7666vte_2024_2_152-169
  { source: "/files/arch/2024/2024-N2/Sinichenko_VTE_2024_2.pdf", destination: "/article/299/" },
  // 10.52342/2587-7666vte_2024_2_170_179
  { source: "/files/arch/2024/2024-N2/Zaostrovtsev_VTE_2024_2.pdf", destination: "/article/300/" },
  // 10.52342/2587-7666vte_2024_3_7_30
  { source: "/files/arch/2024/2024-N3/Dmitriev_VTE_2024_3.pdf", destination: "/article/253/" },
  // 10.52342/2587-7666vte_2024_3_31_49
  { source: "/files/arch/2024/2024-N3/Sablin_Valieva_VTE_2024_3.pdf", destination: "/article/264/" },
  // 10.52342/2587-7666vte_2024_3_50_59
  { source: "/files/arch/2024/2024-N3/Kislitsyna_VTE_2024_3.pdf", destination: "/article/265/" },
  // 10.52342/2587-7666vte_2024_3_60_72
  { source: "/files/arch/2024/2024-N3/Yurevich_VTE_2024_3.pdf", destination: "/article/266/" },
  // 10.52342/2587-7666vte_2024_3_73_92
  { source: "/files/arch/2024/2024-N3/Avakyan_VTE_2024_3.pdf", destination: "/article/267/" },
  // 10.52342/2587-7666vte_2024_3_93_121
  { source: "/files/arch/2024/2024-N3/Klyachko_VTE_2024_3.pdf", destination: "/article/268/" },
  // 10.52342/2587-7666vte_2024_3_122_138
  { source: "/files/arch/2024/2024-N3/Galeev_Chernikov_VTE_2024_3.pdf", destination: "/article/269/" },
  // 10.52342/2587-7666vte_2024_3_139_150
  { source: "/files/arch/2024/2024-N3/Borokh_VTE_2024_3.pdf", destination: "/article/270/" },
  // 10.52342/2587-7666vte_2024_3_151_170
  { source: "/files/arch/2024/2024-N3/Pain_VTE_2024_3.pdf", destination: "/article/271/" },
  // 10.52342/2587-7666vte_2024_3_171_185
  { source: "/files/arch/2024/2024-N3/Medushevskiy_VTE_2024_3.pdf", destination: "/article/272/" },
  // 10.52342/2587-7666vte_2024_3_186_199
  { source: "/files/arch/2024/2024-N3/Tatarko_Bushina_Mironova_VTE_2024_3.pdf", destination: "/article/273/" },
  // 10.52342/2587-7666vte_2024_3_200_215
  { source: "/files/arch/2024/2024-N3/Obolonsky_VTE_2024_3.pdf", destination: "/article/274/" },
  // 10.52342/2587-7666vte_2024_3_216_224
  { source: "/files/arch/2024/2024-N3/Stepanov_VTE_2024_3.pdf", destination: "/article/275/" },
  // 10.52342/2587-7666vte_2024_4_7_21
  { source: "/files/arch/2024/2024-N4/Volchik_Fursa_VTE_2024_4.pdf", destination: "/article/240/" },
  // 10.52342/2587-7666vte_2024_4_22_44
  { source: "/files/arch/2024/2024-N4/Zaostrovtsev_VTE_2024_4.pdf", destination: "/article/241/" },
  // 10.52342/2587-7666vte_2024_4_45_58
  { source: "/files/arch/2024/2024-N4/Tambovtsev_VTE_2024_4.pdf", destination: "/article/242/" },
  // 10.52342/2587-7666vte_2024_4_59_85
  { source: "/files/arch/2024/2024-N4/Balatsky_Ekimova_VTE_2024_4.pdf", destination: "/article/243/" },
  // 10.52342/2587-7666vte_2024_4_86_99
  { source: "/files/arch/2024/2024-N4/Yanovskiy_Zhavoronkov_VTE_2024_4.pdf", destination: "/article/244/" },
  // 10.52342/2587-7666vte_2024_4_100_114
  { source: "/files/arch/2024/2024-N4/Chubarova_VTE_2024_4.pdf", destination: "/article/245/" },
  // 10.52342/2587-7666vte_2024_4_115_127
  { source: "/files/arch/2024/2024-N4/Borokh_VTE_2024_4.pdf", destination: "/article/246/" },
  // 10.52342/2587-7666vte_2024_4_128_141
  { source: "/files/arch/2024/2024-N4/Melnik_VTE_2024_4.pdf", destination: "/article/247/" },
  // 10.52342/2587-7666vte_2024_4_142_158
  { source: "/files/arch/2024/2024-N4/Medushevskiy_VTE_2024_4.pdf", destination: "/article/248/" },
  // 10.52342/2587-7666vte_2024_4_159_174
  { source: "/files/arch/2024/2024-N4/Zarubina_VTE_2024_4.pdf", destination: "/article/249/" },
  // 10.52342/2587-7666vte_2024_4_175_196
  { source: "/files/arch/2024/2024-N4/Rimskiy_VTE_2024_4.pdf", destination: "/article/250/" },
  // 10.52342/2587-7666vte_2024_4_197_214
  { source: "/files/arch/2024/2024-N4/Feldman_VTE_2024_4.pdf", destination: "/article/251/" },
  // 10.52342/2587-7666vte_2024_4_215_224
  { source: "/files/arch/2024/2024-N4/Kruglova_VTE_2024_4.pdf", destination: "/article/252/" },
  // 10.52342/2587-7666vte_2025_1_7_22
  { source: "/files/arch/2025/2025-N1/Antipina_VTE_2025_1.pdf", destination: "/article/228/" },
  // 10.52342/2587-7666vte_2025_1_23_36
  { source: "/files/arch/2025/2025-N1/Pliskevich_VTE_2025_1.pdf", destination: "/article/229/" },
  // 10.52342/2587-7666vte_2025_1_37_50
  { source: "/files/arch/2025/2025-N1/Baturina_VTE_2025_1.pdf", destination: "/article/230/" },
  // 10.52342/2587-7666vte_2025_1_51_64
  { source: "/files/arch/2025/2025-N1/Komarovskaya_VTE_2025_1.pdf", destination: "/article/231/" },
  // 10.52342/2587-7666vte_2025_1_65_78
  { source: "/files/arch/2025/2025-N1/Melnik_VTE_2025_1.pdf", destination: "/article/232/" },
  // 10.52342/2587-7666vte_2025_1_79_92
  { source: "/files/arch/2025/2025-N1/Nisnevich_VTE_2025_1.pdf", destination: "/article/233/" },
  // 10.52342/2587-7666vte_2025_1_93_112
  { source: "/files/arch/2025/2025-N1/Tikhonova_VTE_2025_1.pdf", destination: "/article/234/" },
  // 10.52342/2587-7666vte_2025_1_113_126
  { source: "/files/arch/2025/2025-N1/Efimova_VTE_2025_1.pdf", destination: "/article/235/" },
  // 10.52342/2587-7666vte_2025_1_127_146
  { source: "/files/arch/2025/2025-N1/Rimsky_VTE_2025_1.pdf", destination: "/article/236/" },
  // 10.52342/2587-7666vte_2025_1_147_166
  { source: "/files/arch/2025/2025-N1/Baskakova_VTE_2025_1.pdf", destination: "/article/237/" },
  // 10.52342/2587-7666vte_2025_1_167_184
  { source: "/files/arch/2025/2025-N1/Baranov_VTE_2025_1.pdf", destination: "/article/238/" },
  // 10.52342/2587-7666vte_2025_1_185_196
  { source: "/files/arch/2025/2025-N1/Vinokurov_VTE_2025_1.pdf", destination: "/article/239/" },
  // 10.52342/2587-7666vte_2025_2_7_21
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Shastitko_Pavlova.pdf", destination: "/article/216/" },
  // 10.52342/2587-7666vte_2025_2_22_39
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Pliskevich.pdf", destination: "/article/217/" },
  // 10.52342/2587-7666vte_2025_2_40_54
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Tambovtsev.pdf", destination: "/article/218/" },
  // 10.52342/2587-7666vte_2025_2_55_70
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Ionov.pdf", destination: "/article/219/" },
  // 10.52342/2587-7666vte_2025_2_71_86
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Shestakova.pdf", destination: "/article/220/" },
  // 10.52342/2587-7666vte_2025_2_87_109
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Vasiliev_%20Aleksandrov.pdf", destination: "/article/221/" },
  // 10.52342/2587-7666vte_2025_2_87_109
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Vasiliev_ Aleksandrov.pdf", destination: "/article/221/" },
  // 10.52342/2587-7666vte_2025_2_110_129
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Nisnevich.pdf", destination: "/article/222/" },
  // 10.52342/2587-7666vte_2025_2_130_143
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Medushevskiy.pdf", destination: "/article/223/" },
  // 10.52342/2587-7666vte_2025_2_144_163
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Pavlenko.pdf", destination: "/article/224/" },
  // 10.52342/2587-7666vte_2025_2_164_180
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Makarova_Orekhovsky.pdf", destination: "/article/225/" },
  // 10.52342/2587-7666vte_2025_2_181_195
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Feldman.pdf", destination: "/article/226/" },
  // 10.52342/2587-7666vte_2025_2_196_204
  { source: "/files/arch/2025/2025-N2/VTE_2025_2_Zaostrovtsev.pdf", destination: "/article/227/" },
  // 10.52342/2587-7666vte_2025_3_7_24
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Kheyfets_Chernova.pdf", destination: "/article/204/" },
  // 10.52342/2587-7666vte_2025_3_25_37
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Trofimova.pdf", destination: "/article/205/" },
  // 10.52342/2587-7666vte_2025_3_38_48
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Libman.pdf", destination: "/article/206/" },
  // 10.52342/2587-7666vte_2025_3_49_64
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Kislitsyna.pdf", destination: "/article/207/" },
  // 10.52342/2587-7666vte_2025_3_65_89
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Klyachko.pdf", destination: "/article/208/" },
  // 10.52342/2587-7666vte_2025_3_90_104
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Yurevich_Fedyunina.pdf", destination: "/article/209/" },
  // 10.52342/2587-7666vte_2025_3_105_118
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Zyubina.pdf", destination: "/article/210/" },
  // 10.52342/2587-7666vte_2025_3_119_133
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Medushevskiy.pdf", destination: "/article/211/" },
  // 10.52342/2587-7666vte_2025_3_134_143
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Musikhin.pdf", destination: "/article/212/" },
  // 10.52342/2587-7666vte_2025_3_144_158
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Loginov_Maleva.pdf", destination: "/article/213/" },
  // 10.52342/2587-7666vte_2025_3_159_167
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Kavaliou.pdf", destination: "/article/214/" },
  // 10.52342/2587-7666vte_2025_3_168_178
  { source: "/files/arch/2025/2025-N3/VTE_2025_3_Maltsev_Chichilimov.pdf", destination: "/article/215/" },
];
