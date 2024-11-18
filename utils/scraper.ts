'use server';

import * as cheerio from 'cheerio';

export async function getMemberStudentIds(): Promise<Set<string>> {
  if (
    !process.env.NEXT_PUBLIC_MEMBER_LIST_URL ||
    !process.env.NEXT_PUBLIC_ASPXAUTH_COOKIE
  ) {
    throw new Error(
      'Environment variables MEMBER_LIST_URL and ASPXAUTH_COOKIE must be set'
    );
  }

  const res = await fetch(process.env.NEXT_PUBLIC_MEMBER_LIST_URL, {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      cookie: `.ASPXAUTH=${process.env.NEXT_PUBLIC_ASPXAUTH_COOKIE};`,
    },
  });

  const html = await res.text();

  const $ = cheerio.load(html);

  const guildMemberIds = new Set<string>();

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
          const cardNumber = $(cells[1]).text().trim();
          guildMemberIds.add(cardNumber);
          console.log(`Name: ${name}, Card Number: ${cardNumber}`);
        }
      }
    );
  });

  console.log(`Total unique members: ${guildMemberIds.size}`);
  return guildMemberIds;
}