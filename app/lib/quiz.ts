export type Axis = "pace" | "social" | "structure" | "focus";

export type Question = {
  id: number;
  axis: Axis;
  scene: string;
  left: string;
  right: string;
};

export type BirdResult = {
  id: string;
  name: string;
  english: string;
  image: string;
  body: string;
  accent: string;
};

export const QUESTIONS: Question[] = [
  { id: 1, axis: "pace", scene: "来到一个从没去过的湿地", left: "先看看地图和环境，再决定往哪走", right: "先迈出去，沿路遇见什么就看什么" },
  { id: 2, axis: "pace", scene: "临时收到一项新任务", left: "留一点时间理解要求，稳稳开场", right: "立刻动手，在行动中快速调整" },
  { id: 3, axis: "pace", scene: "朋友们还在犹豫午饭吃什么", left: "等大家想清楚，晚一点也没关系", right: "先提一个方案，把队伍带起来" },
  { id: 4, axis: "pace", scene: "现场突然出现小状况", left: "先判断轻重，找到最稳妥的处理方式", right: "马上处理，先让事情继续运转" },
  { id: 5, axis: "pace", scene: "拥有一个完全空白的周末", left: "慢慢进入状态，享受没有催促的节奏", right: "很快安排活动，想把一天过得饱满" },
  { id: 6, axis: "pace", scene: "看到一条需要回复的消息", left: "想好怎么说，再认真回复", right: "趁着有感觉，马上回过去" },
  { id: 7, axis: "pace", scene: "学习一个新工具", left: "先熟悉基本方法，再逐步尝试", right: "直接上手点一遍，很快就能摸清" },
  { id: 8, axis: "pace", scene: "发现一个很想抓住的机会", left: "确认条件合适，再投入精力", right: "先争取下来，办法可以边走边找" },

  { id: 9, axis: "social", scene: "来到一场几乎没有熟人的活动", left: "先安静观察，遇到投缘的人再聊", right: "主动打招呼，很快认识一圈新朋友" },
  { id: 10, axis: "social", scene: "经历了忙碌的一天", left: "独处一会儿，能量会慢慢回来", right: "找朋友说说话，心情很快就亮起来" },
  { id: 11, axis: "social", scene: "群聊里正热闹地讨论计划", left: "看完大家的想法，再挑重点回应", right: "随时接话，边聊边把气氛带起来" },
  { id: 12, axis: "social", scene: "认识了一位很有趣的人", left: "相处几次后，再慢慢分享自己的故事", right: "很自然地打开话题，很快熟络起来" },
  { id: 13, axis: "social", scene: "旅行时看到绝美日落", left: "先静静看一会儿，把感受留给自己", right: "立刻招呼身边的人一起看、一起拍" },
  { id: 14, axis: "social", scene: "需要在大家面前表达观点", left: "准备充分后会说得更自在", right: "现场的目光会让我更有表达欲" },
  { id: 15, axis: "social", scene: "朋友临时组了一个新局", left: "看看都有谁，再决定要不要加入", right: "有人喊我就去，新朋友也很有意思" },
  { id: 16, axis: "social", scene: "有一个刚冒出来的好点子", left: "先自己想完整，再找合适的人讨论", right: "马上说出来，碰撞几句会更有灵感" },

  { id: 17, axis: "structure", scene: "准备一次两天一夜的小旅行", left: "定个大方向，剩下的看心情", right: "路线、时间和必备物品都会提前理清" },
  { id: 18, axis: "structure", scene: "手上同时来了好几件事", left: "先做当下最有感觉的一件", right: "排好先后顺序，一件件完成" },
  { id: 19, axis: "structure", scene: "原定计划被天气打乱", left: "顺势换个玩法，也许会有新惊喜", right: "快速启用备用方案，继续按节奏推进" },
  { id: 20, axis: "structure", scene: "房间或桌面变得有点乱", left: "只要找得到东西，就不太影响我", right: "整理归位以后，整个人都会更舒服" },
  { id: 21, axis: "structure", scene: "接到一个月后才截止的项目", left: "灵感来的时候集中完成", right: "拆成几个节点，每周推进一点" },
  { id: 22, axis: "structure", scene: "买到一件需要组装的新物品", left: "先凭直觉试试，卡住了再看说明", right: "先读步骤，确认零件再开始" },
  { id: 23, axis: "structure", scene: "朋友突然提出改变行程", left: "可以呀，新安排听起来也不错", right: "先确认时间和影响，再决定怎么改" },
  { id: 24, axis: "structure", scene: "每天要做的事情比较多", left: "脑子里记个大概，随机应变", right: "列一张清单，看着它逐项完成" },

  { id: 25, axis: "focus", scene: "朋友来找你聊一件烦心事", left: "先感受他的情绪，让他知道有人理解", right: "帮他梳理问题，找出可以行动的办法" },
  { id: 26, axis: "focus", scene: "大家对一个方案意见不一致", left: "先照顾关系，让每个人都能被听见", right: "回到目标和事实，选出更有效的方案" },
  { id: 27, axis: "focus", scene: "评价一份刚完成的作品", left: "我会先注意它带来的感受和氛围", right: "我会先看信息是否准确、结构是否清楚" },
  { id: 28, axis: "focus", scene: "为朋友挑选生日礼物", left: "选一件能表达心意、带来共鸣的东西", right: "选一件品质可靠、真正派得上用场的东西" },
  { id: 29, axis: "focus", scene: "团队里有人犯了一个小错误", left: "先了解当时的处境，再一起补救", right: "先修正影响，再复盘怎样避免重演" },
  { id: 30, axis: "focus", scene: "逛一座自然博物馆", left: "更容易被故事、画面和生命经历吸引", right: "更容易被物种知识、数据和原理吸引" },
  { id: 31, axis: "focus", scene: "决定要不要参加一项新活动", left: "想到会和谁一起、会留下什么感受", right: "想到能学到什么、会得到什么成果" },
  { id: 32, axis: "focus", scene: "需要做一个重要选择", left: "内心是否舒展，是我很看重的信号", right: "条件是否合理，是我很看重的依据" },
];

export const BIRDS: Record<string, BirdResult> = {
  "----": { id: "mood-poet", name: "氛围文青", english: "MOOD POET", image: "/birds/mood-poet.png", accent: "#ef5b2a", body: "你对光线、声音和情绪的细微变化格外敏感。你喜欢给生活留一点缓慢生长的空间，也很会捕捉那些容易被忽略的美好瞬间。和你相处的人，常常会重新发现日常里的诗意。" },
  "---+": { id: "social-diver", name: "社恐潜水员", english: "SOCIAL DIVER", image: "/birds/social-diver.png", accent: "#79508f", body: "你习惯先在自己的水域里观察，确认安全和有趣之后再浮出水面。安静给了你清晰的判断力，熟悉的关系则会唤醒你的幽默与活力。你珍惜有质量的连接，也懂得保护自己的能量。" },
  "--+-": { id: "steady-bro", name: "稳健老哥", english: "STEADY BRO", image: "/birds/steady-bro.png", accent: "#145b91", body: "你沉得住气，遇到变化时会先看清水面下的情况。可靠、克制和耐心构成了你的节奏，真正需要出手时，你往往能稳稳接住局面。身边的人会把你当作值得信任的定心丸。" },
  "--++": { id: "big-picture", name: "大局控", english: "BIG PICTURE", image: "/birds/big-picture.png", accent: "#315f24", body: "你擅长从高处看见事情之间的联系，也愿意花时间理解全局。面对复杂问题，你会整理线索、判断方向，再把精力放到关键位置。你的安静里藏着清醒的战略感。" },
  "-+--": { id: "curious-bean", name: "好奇宝宝", english: "CURIOUS BEAN", image: "/birds/curious-bean.png", accent: "#df4f4f", body: "世界对你来说像一片随时会冒出新发现的芦苇荡。你愿意靠近、提问和尝试，也很容易把这份新鲜感传给身边的人。你的好奇心让普通的一天多出许多支线剧情。" },
  "-+-+": { id: "go-with-it", name: "随缘玩家", english: "GO WITH IT", image: "/birds/go-with-it.png", accent: "#126aa5", body: "你很会顺着环境找到舒服的水流，变化很少让你慌张。你相信体验会带来答案，也擅长在偶然里发现乐趣。和你同行，行程常常轻松又充满意外惊喜。" },
  "-++-": { id: "care-pack", name: "暖心管家", english: "CARE PACK", image: "/birds/care-pack.png", accent: "#e45a22", body: "你对身边人的状态有天然雷达，总能留意到那些还没说出口的需要。温柔在你这里带着行动力：递上一杯水、补好一个缺口、记住一件小事。你让团队拥有被照顾的踏实感。" },
  "-+++": { id: "team-mode", name: "组队党", english: "TEAM MODE", image: "/birds/team-mode.png", accent: "#3f6f22", body: "你喜欢和伙伴共享路线、发现与笑声。对你来说，一群人彼此照应，会让旅程更有意义。你善于融入协作，也会自然地维护团队的默契与安全感。" },
  "+---": { id: "action-first", name: "冲锋选手", english: "ACTION FIRST", image: "/birds/action-first.png", accent: "#38651f", body: "你对机会的反应很快，想到就愿意下水试一试。行动会帮你整理思路，真实反馈也比长时间犹豫更能给你答案。你的果断经常为团队打开第一条路。" },
  "+--+": { id: "main-character", name: "湖边显眼包", english: "MAIN CHARACTER", image: "/birds/main-character.png", accent: "#7e4b91", body: "你拥有很强的现场存在感，也愿意用自己的方式留下鲜明印记。表达、创意和一点点戏剧感，让你走到哪里都容易成为画面中心。你给平常时刻加上了值得记住的高光。" },
  "+-+-": { id: "nailed-it", name: "拿捏大师", english: "NAILED IT", image: "/birds/nailed-it.png", accent: "#1769a3", body: "你出手利落，背后却有细致的观察和判断。面对目标时，你会先锁定关键，再用恰到好处的动作完成它。你的效率来自专注，也来自对时机的敏锐把握。" },
  "+-++": { id: "foodie-champ", name: "干饭狠人", english: "FOODIE CHAMP", image: "/birds/foodie-champ.png", accent: "#3d6a27", body: "你对喜欢的事投入直接又专注，认真享受也认真完成。清晰的目标会迅速调动你的能量，过程里的细节也很难逃过你的眼睛。你用充足的行动力，把小事做出专业范儿。" },
  "++--": { id: "hype-buddy", name: "热场达人", english: "HYPE BUDDY", image: "/birds/hype-buddy.png", accent: "#f05b24", body: "你自带升温能力，常常一句话就能让场子活起来。热情、响应和分享欲让你成为人群里的能量补给站。你喜欢大家一起进入状态，也享受每一次快乐的回声。" },
  "++-+": { id: "instant-bestie", name: "社牛搭子", english: "INSTANT BESTIE", image: "/birds/instant-bestie.png", accent: "#dc5d12", body: "你很容易越过陌生感，快速找到和别人相处的共同频道。你愿意发起对话、交换情报、临时组队，也常把路人变成同行伙伴。你的开放让世界显得格外热闹。" },
  "+++-": { id: "squad-leader", name: "领队大哥", english: "SQUAD LEADER", image: "/birds/squad-leader.png", accent: "#155993", body: "你在行动中会自然地关注方向与队伍状态。目标明确时，你愿意承担责任、协调节奏，也能鼓励大家跟上。你的带领很有感染力，让同行的人更敢向前。" },
  "++++": { id: "stock-it-up", name: "囤货狂魔", english: "STOCK IT UP", image: "/birds/stock-it-up.png", accent: "#3d6d28", body: "你喜欢为未来多准备一步，资源、信息和工具都能被你安排得明明白白。未雨绸缪会给你安全感，也让你在关键时刻总有东西可用。你的储备能力，是团队里很实在的底气。" },
};

export function scoreQuiz(answers: number[]) {
  const scores: Record<Axis, number> = { pace: 0, social: 0, structure: 0, focus: 0 };

  QUESTIONS.forEach((question, index) => {
    scores[question.axis] += answers[index] ?? 0;
  });

  const signature = (["pace", "social", "structure", "focus"] as Axis[])
    .map((axis) => (scores[axis] >= 0 ? "+" : "-"))
    .join("");

  return { result: BIRDS[signature], signature, scores };
}
