import * as cheerio from 'cheerio';

export async function getMemberStudentIds(): Promise<
  { firstName: string; lastName: string; studentId: string }[]
> {
  if (!process.env.MEMBER_LIST_URL || !process.env.ASPXAUTH_COOKIE) {
    throw new Error(
      'Environment variables MEMBER_LIST_URL and ASPXAUTH_COOKIE must be set'
    );
  }

  const res = await fetch(process.env.MEMBER_LIST_URL, {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      cookie: `.ASPXAUTH=${process.env.ASPXAUTH_COOKIE};`,
    },
  });

  const html = await res.text();

  const $ = cheerio.load(html);

  const guildMembers: {
    firstName: string;
    lastName: string;
    studentId: string;
  }[] = [];

  const MEMBER_HTML_TABLE_IDS = new Set([
    'ctl00_ctl00_Main_AdminPageContent_gvMembers',
    'ctl00_Main_rptGroups_ctl05_gvMemberships',
    'ctl00_Main_rptGroups_ctl03_gvMemberships',
  ]);

  MEMBER_HTML_TABLE_IDS.forEach((tableId) => {
    $(`#${tableId} tr.msl_row, #${tableId} tr.msl_altrow`).each(
      (index, element) => {
        const cells = $(element).find('td');
        if (cells.length >= 2) {
          const name = $(cells[0]).text().trim();
          const studentId = $(cells[1]).text().trim();

          const [lastName, firstName] = name
            .split(',')
            .map((part) => part.trim());

          if (!firstName || !lastName || !studentId) {
            console.error('Invalid member data, something is missing:', {
              firstName,
              lastName,
              studentId,
            });
            return;
          }

          guildMembers.push({
            firstName,
            lastName,
            studentId,
          });

          // console.log(
          //   `Name: ${firstName} ${lastName}, Card Number: ${studentId}`
          // );
        }
      }
    );
  });

  // console.log(`Total unique members: ${guildMembers.length}`);
  return guildMembers;
}
