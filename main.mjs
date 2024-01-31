import { chromium, devices } from 'playwright';
import assert from 'node:assert';
import totp from 'totp-generator';

const TERM = '202350';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const browser = await chromium.launch({
  headless: false,
});
const context = await browser.newContext(devices['Desktop Chrome']);
const page = await context.newPage();
await page.goto('https://webcat.unh.edu');
await page.locator('input[type=email]').fill(process.env.EMAIL);
await page.getByText('Next').click();
await page.waitForTimeout(3000);
await page.locator('input[type=password]').fill(process.env.PASSWORD);
await page.locator('input[type=submit]').click();
await page.waitForTimeout(3000);
await page.locator('input[name=otc]').fill(totp(process.env.TOTP));
await page.locator('input[type=submit]').click();
await page.waitForTimeout(3000);
await page.locator('input[type=submit]').click();
await page.waitForTimeout(3000);

await page.route('**/prod/bwskfcls.P_GetCrse_Advanced', (route) => {
  // Fake a submission of the course lookup form
  function createRequestBody(obj) {
    return Object.entries(obj)
      .flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.map((value) => createRequestBody({ [key]: value }))
          : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }
  const reqBody = createRequestBody({
    rsts: 'dummy',
    crn: 'dummy',
    // TODO: This should adapt to the current semester (or fetch upcoming semesters as well for additional data during course registration season?)
    term_in: TERM,
    sel_subj: [
      'dummy',
      'INTR',
      'ACC',
      'ACFI',
      'ACCT',
      'ADMN',
      'AERO',
      'ANFS',
      'ASL',
      'AMST',
      'DATA',
      'ANSC',
      'ANTH',
      'AAS',
      'APST',
      'ARBC',
      'ARTH',
      'ART',
      'ARTS',
      'BMCB',
      'BEHS',
      'BCHM',
      'BSCI',
      'BIOL',
      'BMS',
      'BIOT',
      'BUS',
      'LBS',
      'CHBE',
      'CHEM',
      'CHIN',
      'CEE',
      'CLAS',
      'LCL',
      'COLA',
      'CMN',
      'CA',
      'COMM',
      'COM',
      'CEP',
      'CS',
      'CMPL',
      'COMP',
      'CRIM',
      'LCR',
      'CRIT',
      'CPRM',
      'LDWS',
      'DAT',
      'DS',
      'DPP',
      'ESCI',
      'EOS',
      'ECOG',
      'ECON',
      'ECO',
      'ECN',
      'EDUC',
      'EDC',
      'ECE',
      'ET',
      'ENGL',
      'ENG',
      'ESL',
      'ENT',
      'EREC',
      'EXCH',
      'EXSC',
      'FIN',
      'FNC',
      'FSA',
      'FORT',
      'FREN',
      'LGP',
      'GEN',
      'GEOG',
      'GSS',
      'GERM',
      'GCHS',
      'GRAD',
      'GREK',
      'HHS',
      'HLTC',
      'HDS',
      'HMP',
      'HS',
      'HPE',
      'HIST',
      'HIS',
      'HLS',
      'HONR',
      'HMGT',
      'HRT',
      'HDFS',
      'HRM',
      'HMSV',
      'HUMA',
      'HUMN',
      'IT',
      'INST',
      'IAM',
      'LIP',
      'INCO',
      'IDIS',
      'IA',
      'ITAL',
      'JUST',
      'KIN',
      'LLC',
      'LATN',
      'LAW',
      'LD',
      'LS',
      'LSA',
      'LAP',
      'LING',
      'MGT',
      'MGMT',
      'MARI',
      'MEFB',
      'MKTG',
      'MKT',
      'MS',
      'MATH',
      'MTH',
      'ME',
      'MICR',
      'MILT',
      'MCBS',
      'MUSI',
      'MUED',
      'NSIA',
      'NR',
      'NRES',
      'NPSY',
      'NSB',
      'NURS',
      'NUR',
      'NUTR',
      'OT',
      'OE',
      'OCE',
      'OPS',
      'OUT',
      'PAUL',
      'PHIL',
      'PHYS',
      'POLT',
      'POL',
      'PS',
      'PTC',
      'PM',
      'PSYC',
      'PSY',
      'PA',
      'PADM',
      'PHP',
      'LPI',
      'PPOL',
      'RMP',
      'XXX',
      'RS',
      'LRS',
      'RUSS',
      'SCI',
      'LSK',
      'SOSC',
      'SW',
      'SOC',
      'SOCI',
      'SPAN',
      'SLA',
      'SML',
      'SCM',
      'SUST',
      'SAFS',
      'TSAS',
      'TECH',
      'THDA',
      'TOUR',
      'UMIS',
      'UMNA',
      'UMST',
      'VTEC',
      'WS',
      'ZOOL',
    ],
    sel_day: 'dummy',
    sel_schd: 'dummy',
    sel_insm: 'dummy',
    sel_camp: ['dummy', '1'],
    sel_levl: ['dummy', '%'],
    sel_sess: 'dummy',
    sel_instr: ['dummy', '%'],
    sel_ptrm: ['dummy', '1'],
    sel_attr: ['dummy', '%'],
    sel_crse: '',
    sel_title: '',
    sel_from_cred: '',
    sel_to_cred: '',
    begin_hh: '0',
    begin_mi: '0',
    begin_ap: 'a',
    end_hh: '0',
    end_mi: '0',
    end_ap: 'a',
    SUB_BTN: 'Section+Search',
    path: '1',
  });

  route.continue({
    headers: {
      ...route.request().headers(),
      accept: 'text/html',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
    },
    postData: reqBody,
    method: 'POST',
  });
});

await page.goto('https://webcat.unh.edu/prod/bwskfcls.P_GetCrse_Advanced');

const html = await page.content();

await fetch(
  `https://better-timeroom.scratchyone.workers.dev/courses/${TERM}?passwd=${process.env.PASSWD}`,
  {
    method: 'POST',
    body: html,
  }
);

browser.close();
