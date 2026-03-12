// ── Harold Grayblood personal seed data ──────────────────────────────────────
// NOT imported by the app — use manually to restore Harold's starting content.
// This data was removed from constants.js in Phase 4D (2026-03-11).
// To load: copy the arrays you need and paste into the browser console:
//   localStorage.setItem("hg_ideas",   JSON.stringify(HAROLD_IDEAS));
//   localStorage.setItem("hg_journal", JSON.stringify(HAROLD_JOURNAL));
//   localStorage.setItem("hg_episodes",JSON.stringify(HAROLD_EPISODES));
// Then refresh the app.

export const HAROLD_IDEAS = [
  {id:1,category:"Character Concept",title:"The Oathbreaker's Redemption",content:"Harold once swore to protect a village, only to flee when the draugr came. Now he walks back toward danger — every time.",tags:["redemption","oath","guilt"]},
  {id:2,category:"Roleplay Rule",title:"No Fast Travel",content:"Every step of Skyrim must be walked. The road is the story.",tags:["immersion","travel"]},
  {id:3,category:"Quest Idea",title:"The Grey Blood Pact",content:"Find the origin of the Grayblood name. A blood oath made three generations ago with a Daedric Prince.",tags:["daedra","lore","family"]},
];

export const HAROLD_JOURNAL = [
  {id:1,date:"17th of Last Seed, 4E 201",title:"Helgen",format:{font:"kalam",size:18,align:"left",bold:false,italic:false},body:"They nearly took my head today. A dragon — gods, a real dragon — saved me without meaning to.\n\nThe Imperials had me on the block. I thought of nothing. Not family, not the debts, not the blood I owe. Just the cold stone and the headsman's shadow.\n\nThen the sky broke open.\n\nI ran with a Stormcloak. Ralof. He seems decent enough for a rebel. We parted ways at the keep's edge. I told him nothing about myself. That felt right."},
];

export const HAROLD_EPISODES = [
  {id:1,title:"Harold Grayblood — Origins",episode:1,status:"uploaded",description:"The beginning of Harold's journey. Helgen, the dragon attack, and the road to Riverwood.",thumbnail:null,thumbnailName:"",tags:["intro","helgen"],notes:"Strong opener. Hook was the execution scene.",scheduledDate:""},
  {id:2,title:"The Road to Whiterun",episode:2,status:"recorded",description:"Harold walks every step. No fast travel. The plains of Whiterun hold more than they seem.",thumbnail:null,thumbnailName:"",tags:["travel","whiterun"],notes:"B-roll of sunrise worked great.",scheduledDate:"2025-02-28"},
  {id:3,title:"Joining the Companions",episode:3,status:"planned",description:"Does a man of grey honour belong among warriors?",thumbnail:null,thumbnailName:"",tags:["companions","honour"],notes:"",scheduledDate:"2025-03-07"},
];
