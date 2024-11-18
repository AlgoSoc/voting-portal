'use server';

const pinData: any = require('../data/pins.json');

let voteTable: any = {};
let electionTopic: string = '';

function out(str: string) {
  console.log(`[${new Date().toUTCString()}] ` + str);
}

function login(studentID: string, pin: string): [boolean, string] {
  if (!Object.keys(pinData).includes(studentID)) {
    return [false, 'Not a member of AlgoSoc'];
  }
  if (pinData[studentID] != pin) return [false, 'Invalid PIN'];
  return [true, 'Login successful'];
}

function vote(
  studentID: string,
  pin: string,
  desiredVote: string
): [boolean, string] {
  voteTable[studentID] = desiredVote;
  out(`${studentID} | ${desiredVote}`);
  console.table(voteTable);
  const loginResult: any = login(studentID, pin);
  if (!loginResult[0]) return loginResult[1];
  return [true, 'Vote successful'];
}

async function getElectionTopic(): Promise<string> {
  return electionTopic;
}

async function setElectionTopic(adminPin: string, newTopic: string) {
  if (adminPin != process.env['ADMIN_PIN']) return;
  console.log('\n');
  console.log('--- NEW ELECTION TOPIC ---');
  console.log(newTopic);
  console.log('');
  electionTopic = newTopic;
}

async function getVoteTable(adminPin: string) {
  if (adminPin != process.env['ADMIN_PIN']) return;
  return voteTable;
}

export { login, vote, getElectionTopic, setElectionTopic, getVoteTable };
