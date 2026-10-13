// WBTI 题目、鸟格资料和评分逻辑的唯一权威来源。评分只在浏览器内完成。
import { assetUrl } from "./asset.ts";

export type Axis = "pace" | "social" | "structure" | "focus";
export type Pole = "-" | "+";
export type AnswerValue = -2 | -1 | 1 | 2;

export type AxisInfo = {
  id: Axis;
  name: string;
  minus: string;
  plus: string;
};

export type Question = {
  id: number;
  axis: Axis;
  scene: string;
  hint: string;
  /** 按从“-”极到“+”极的顺序书写；页面显示顺序由 displayOptions 决定。 */
  options: readonly { value: AnswerValue; label: string }[];
};

export type BirdType = {
  /** 四个维度的方向，顺序为 pace / social / structure / focus。 */
  code: string;
  number: number;
  id: string;
  name: string;
  english: string;
  species: string;
  speciesEnglish: string;
  image: string;
  accent: string;
  tagline: string;
  traits: readonly [string, string, string];
  body: string;
  birdNote: string;
  watchOut: string;
};

export type AxisResult = {
  axis: AxisInfo;
  score: number;
  max: number;
  pole: Pole;
  /** 偏向主导一侧的程度，50–100。 */
  strength: number;
};

export type QuizOutcome = {
  code: string;
  bird: BirdType;
  axes: AxisResult[];
};

export const AXES: readonly AxisInfo[] = [
  { id: "pace", name: "行动节奏", minus: "先观察", plus: "先起飞" },
  { id: "social", name: "社交电量", minus: "独处回血", plus: "群聚回血" },
  { id: "structure", name: "计划偏好", minus: "随风而飞", plus: "按航线飞" },
  { id: "focus", name: "决策关注", minus: "跟着感受", plus: "跟着事实" },
];

// 四个维度轮流出现，避免连续六题都在问同一件事。
export const QUESTIONS: Question[] = [
  { id: 1, axis: "pace", scene: "周五晚上，朋友突然喊你明早去看日出", hint: "群里正在等你回话，你会——", options: [
    { value: -2, label: "先查天气、路线和起床时间，再决定" },
    { value: -1, label: "问清集合时间，确认能起床就去" },
    { value: 1, label: "先答应，睡前再简单搜一下攻略" },
    { value: 2, label: "立刻回“冲”，剩下的明早再说" },
  ] },
  { id: 2, axis: "social", scene: "来到一场几乎没有熟人的活动", hint: "开场十分钟，你通常在——", options: [
    { value: -2, label: "找个舒服的位置，先观察现场" },
    { value: -1, label: "和身边一两个人慢慢聊起来" },
    { value: 1, label: "跟着熟人加入一桌人的话题" },
    { value: 2, label: "主动串场，很快认识一圈新朋友" },
  ] },
  { id: 3, axis: "structure", scene: "准备一次两天一夜的小旅行", hint: "出发前你的准备程度是——", options: [
    { value: -2, label: "定好目的地就行，到了再看心情" },
    { value: -1, label: "收藏几个地点，路线当天再排" },
    { value: 1, label: "排好主要行程，给临时变化留点空" },
    { value: 2, label: "路线、时间、交通和物品都提前理清" },
  ] },
  { id: 4, axis: "focus", scene: "朋友深夜发来一大段消息，说自己最近很难受", hint: "你最先会回——", options: [
    { value: -2, label: "“听起来真的很难熬，我陪你聊会儿。”" },
    { value: -1, label: "先接住情绪，再问发生了什么" },
    { value: 1, label: "先弄清事情经过，陪 TA 一起找突破口" },
    { value: 2, label: "把问题拆开，给出几步能马上做的事" },
  ] },
  { id: 5, axis: "pace", scene: "群里出现一句“这个谁来做”，然后全员装死", hint: "你的第一反应是——", options: [
    { value: -2, label: "先把需求和坑点看完，再决定接不接" },
    { value: -1, label: "先问清范围，能做的话再认领" },
    { value: 1, label: "先接下一部分，边做边补信息" },
    { value: 2, label: "我先来，开工后再把大家摇醒" },
  ] },
  { id: 6, axis: "social", scene: "忙碌的一天终于结束，你整个人快没电了", hint: "最有效的回血方式是——", options: [
    { value: -2, label: "关掉消息，自己安静待一会儿" },
    { value: -1, label: "做点喜欢的事，晚些再回消息" },
    { value: 1, label: "找熟悉的人吃饭，轻松聊几句" },
    { value: 2, label: "立刻约人见面，聊热闹了就满血" },
  ] },
  { id: 7, axis: "structure", scene: "上午同时来了四件都挺急的事", hint: "你会从哪里开始——", options: [
    { value: -2, label: "先做最有感觉的一件，让自己动起来" },
    { value: -1, label: "挑最容易完成的，先清掉一个" },
    { value: 1, label: "快速判断轻重缓急，再依次处理" },
    { value: 2, label: "列出顺序和时间块，严格按表推进" },
  ] },
  { id: 8, axis: "focus", scene: "大家为一个方案争了半天，谁也说服不了谁", hint: "轮到你推进讨论——", options: [
    { value: -2, label: "先让每个人把顾虑说完，别伤了关系" },
    { value: -1, label: "找共同点，拼出一个大家能接受的方案" },
    { value: 1, label: "重新对齐目标，用标准比较每个方案" },
    { value: 2, label: "直接看数据和效果，选最有效的那个" },
  ] },
  { id: 9, axis: "pace", scene: "奶茶店上了一个名字很离谱的限时新品", hint: "轮到你点单了——", options: [
    { value: -2, label: "看完配料和评价，还是点熟悉款" },
    { value: -1, label: "先问店员味道，听起来靠谱才点" },
    { value: 1, label: "跟朋友拼一杯，尝过再决定站队" },
    { value: 2, label: "新品必须点，踩雷也能发朋友圈" },
  ] },
  { id: 10, axis: "social", scene: "群聊里正在热烈讨论周末计划", hint: "你在群里的状态更像——", options: [
    { value: -2, label: "默默看完，确定关键信息就好" },
    { value: -1, label: "等想法成形后，发一条完整回复" },
    { value: 1, label: "看到有意思的就接一句，偶尔发表情" },
    { value: 2, label: "持续接话，顺手把气氛和计划带起来" },
  ] },
  { id: 11, axis: "structure", scene: "出门后下起大雨，原定计划全部泡汤", hint: "同行的人都在看你——", options: [
    { value: -2, label: "随便找个方向走，意外也许更好玩" },
    { value: -1, label: "搜搜附近，临时选个大家想去的" },
    { value: 1, label: "比较几个室内去处，重新排一下顺序" },
    { value: 2, label: "直接启用备用方案，按新路线继续走" },
  ] },
  { id: 12, axis: "focus", scene: "朋友把刚完成的作品发给你看", hint: "你第一眼更容易注意到——", options: [
    { value: -2, label: "它传达出的情绪，哪里最打动我" },
    { value: -1, label: "整体氛围顺不顺，有没有个人味道" },
    { value: 1, label: "信息清不清楚，重点有没有被看见" },
    { value: 2, label: "结构和细节是否准确，有没有明显漏洞" },
  ] },
  { id: 13, axis: "pace", scene: "出门五分钟，发现手机只剩 8% 的电", hint: "今天还要在外面待很久——", options: [
    { value: -2, label: "马上开省电，重新安排手机用量" },
    { value: -1, label: "先找附近能充电的地方，心里有底" },
    { value: 1, label: "少刷一会儿，真不够再借充电宝" },
    { value: 2, label: "照常用，没电了总会有办法" },
  ] },
  { id: 14, axis: "social", scene: "刚认识的人，意外和你很聊得来", hint: "这段新关系通常会——", options: [
    { value: -2, label: "先停在愉快聊天，慢慢确认边界" },
    { value: -1, label: "留个联系方式，之后有缘再聊" },
    { value: 1, label: "顺势多聊一会儿，分享一些近况" },
    { value: 2, label: "当天就像老朋友，下一次局都约好了" },
  ] },
  { id: 15, axis: "structure", scene: "桌面已经乱到朋友问你“东西找得到吗”", hint: "你的真实状态是——", options: [
    { value: -2, label: "找得到就行，这套摆法有自己的逻辑" },
    { value: -1, label: "乱归乱，真影响做事时我才会收" },
    { value: 1, label: "空下来会顺手整理，让常用物归位" },
    { value: 2, label: "现在就想收好，整齐以后脑子才清爽" },
  ] },
  { id: 16, axis: "focus", scene: "要给一个很重要的朋友挑生日礼物", hint: "你更可能选——", options: [
    { value: -2, label: "一件和共同回忆有关、很有心意的东西" },
    { value: -1, label: "符合 TA 的审美，拆开会开心的东西" },
    { value: 1, label: "TA 最近提过、确实会用到的东西" },
    { value: 2, label: "品质可靠、耐用且解决实际需求的东西" },
  ] },
  { id: 17, axis: "pace", scene: "周末醒来，发现今天没有任何安排", hint: "你更可能这样开启一天——", options: [
    { value: -2, label: "慢慢起床，等身体和脑子都加载好" },
    { value: -1, label: "先吃点东西，再看看附近有什么" },
    { value: 1, label: "约个人出门，边走边决定去哪儿" },
    { value: 2, label: "立刻搜活动，空白周末得长出剧情" },
  ] },
  { id: 18, axis: "social", scene: "旅行时撞见一场特别漂亮的日落", hint: "你最自然的反应是——", options: [
    { value: -2, label: "先静静看，把这一刻留给自己" },
    { value: -1, label: "拍一张留念，晚点发给亲近的人" },
    { value: 1, label: "喊同行的人一起看，互相拍照" },
    { value: 2, label: "招呼周围的人，现场共享这份惊喜" },
  ] },
  { id: 19, axis: "structure", scene: "接到一个月后才截止的大项目", hint: "第一周你通常会——", options: [
    { value: -2, label: "先放着，等状态和灵感一起出现" },
    { value: -1, label: "记住截止时间，最近有空就动一点" },
    { value: 1, label: "先拆大步骤，给关键环节留出时间" },
    { value: 2, label: "当天建好时间表，每周按节点推进" },
  ] },
  { id: 20, axis: "focus", scene: "队友犯了个小错误，大家得一起返工", hint: "你会先处理——", options: [
    { value: -2, label: "看看 TA 是不是很自责，先让人缓过来" },
    { value: -1, label: "问清当时的处境，再一起补救" },
    { value: 1, label: "先把影响修正，之后再温和复盘" },
    { value: 2, label: "立刻止损并查清原因，避免再次发生" },
  ] },
  { id: 21, axis: "pace", scene: "喜欢的人突然发来一句“在干嘛”", hint: "看到消息后的你——", options: [
    { value: -2, label: "输入又删除，想好怎么接话再发" },
    { value: -1, label: "稍微组织一下，几分钟后回复" },
    { value: 1, label: "先回正在做什么，再慢慢找话题" },
    { value: 2, label: "秒回，聊天能不能起飞先开口再说" },
  ] },
  { id: 22, axis: "social", scene: "临时被点名，在大家面前讲两分钟", hint: "你会怎么应对——", options: [
    { value: -2, label: "争取一点准备时间，理清再开口" },
    { value: -1, label: "先写三个要点，照着重点讲" },
    { value: 1, label: "直接讲，看到听众反应再调整" },
    { value: 2, label: "接过话筒，现场目光会让我更来劲" },
  ] },
  { id: 23, axis: "structure", scene: "快递到了，是一件需要自己组装的新物品", hint: "拆开包装后——", options: [
    { value: -2, label: "先凭直觉装，卡住了再找说明书" },
    { value: -1, label: "大概扫一眼图，觉得会了就开装" },
    { value: 1, label: "对照步骤边看边装，避免返工" },
    { value: 2, label: "先清点零件、读完说明，再正式开始" },
  ] },
  { id: 24, axis: "focus", scene: "走进一座很大的自然博物馆", hint: "最容易让你停下来的展板是——", options: [
    { value: -2, label: "讲一只动物经历的故事和影像" },
    { value: -1, label: "还原栖息地氛围的沉浸式展区" },
    { value: 1, label: "解释物种关系和演化过程的图表" },
    { value: 2, label: "信息密度很高的标本、数据和原理" },
  ] },
];

// 原型鸟已与真实照片核对过关键特征；鸟类小知识只写公认、可核实的习性。
export const BIRD_TYPES: readonly BirdType[] = [
  {
    code: "----", number: 1, id: "mood-poet", name: "氛围文青", english: "MOOD POET",
    species: "大天鹅", speciesEnglish: "Whooper Swan", image: "/birds-v3/mood-poet.jpg", accent: "#d9572b",
    tagline: "把日子过成一首慢慢写的诗",
    traits: ["细腻", "慢热", "审美在线"],
    body: "你对光线、声音和情绪的细微变化格外敏感，不急着表态，也不急着合群。你习惯给生活留一点缓慢生长的空间，很会捕捉那些容易被忽略的美好瞬间。和你相处的人，常常会重新发现日常里的诗意。",
    birdNote: "大天鹅在水面上总是从容漂着，迁徙时却能飞越几千公里。它们通常长期成对生活，一家子一起越冬——慢，不代表走不远。",
    watchOut: "灵感来了总想再等等，但有些机会需要你先迈出一步。",
  },
  {
    code: "---+", number: 2, id: "social-diver", name: "社恐潜水员", english: "SOCIAL DIVER",
    species: "小䴙䴘", speciesEnglish: "Little Grebe", image: "/birds-v3/social-diver.jpg", accent: "#79508f",
    tagline: "先潜下去看清楚，再决定要不要浮上来",
    traits: ["观察力强", "边界清晰", "冷幽默"],
    body: "你习惯先在自己的水域里观察，确认安全和有趣之后再浮出水面。安静给了你清晰的判断，熟悉的关系才会唤醒你的幽默与活力。你珍惜有质量的连接，也懂得保护自己的能量。",
    birdNote: "小䴙䴘是潜水高手，一受惊就钻进水里，过一会儿才从别处冒出来。它的脚趾长着瓣状的蹼，特别适合在水下划水。",
    watchOut: "别总等到百分百安全才开口，你的想法比你以为的更有分量。",
  },
  {
    code: "--+-", number: 3, id: "steady-bro", name: "稳健老哥", english: "STEADY BRO",
    species: "苍鹭", speciesEnglish: "Grey Heron", image: "/birds-v3/steady-bro.jpg", accent: "#145b91",
    tagline: "不慌，等时机自己游过来",
    traits: ["沉得住气", "靠谱", "有耐心"],
    body: "你沉得住气，遇到变化时会先看清水面下的情况，再按自己的节奏一步步来。你不爱把情绪挂在脸上，却会默默照顾身边人的感受。真正需要出手时，你往往能稳稳接住局面，是大家心里的定心丸。",
    birdNote: "苍鹭常在浅水里一动不动地站很久，看起来像在发呆，其实是在等鱼游进攻击范围，再用长长的喙闪电般一啄。",
    watchOut: "稳是你的优势，偶尔也让别人看见你的情绪和需要。",
  },
  {
    code: "--++", number: 4, id: "big-picture", name: "大局控", english: "BIG PICTURE",
    species: "东方白鹳", speciesEnglish: "Oriental Stork", image: "/birds-v3/big-picture.jpg", accent: "#315f24",
    tagline: "飞得够高，才看得清整片湖",
    traits: ["战略感", "冷静", "全局视角"],
    body: "你擅长从高处看见事情之间的联系，愿意先花时间理解全局。面对复杂问题，你会整理线索、判断方向，再把精力放在关键位置。你的安静里藏着清醒的战略感。",
    birdNote: "东方白鹳很会借上升的热气流盘旋升高，再长距离滑翔，省力又看得远。它是国家一级重点保护野生动物。",
    watchOut: "想清楚再行动很好，但计划不必等到完美才开始。",
  },
  {
    code: "-+--", number: 5, id: "curious-bean", name: "好奇宝宝", english: "CURIOUS BEAN",
    species: "银喉长尾山雀", speciesEnglish: "Silver-throated Bushtit", image: "/birds-v3/curious-bean.jpg", accent: "#c9474a",
    tagline: "对世界保持好奇，也喜欢和大家挤在一起",
    traits: ["好奇心", "亲和力", "爱分享"],
    body: "世界对你来说像一片随时会冒出新发现的树林。你不一定第一个冲出去，但会认真靠近、提问和尝试，也很容易把这份新鲜感分享给身边的人。你的好奇心让普通的一天多出许多支线剧情。",
    birdNote: "长尾山雀常常成群在枝头穿梭觅食。冬天的夜里，它们会一只挨一只排排挤在树枝上取暖。",
    watchOut: "兴趣很多是好事，挑一两件坚持下去，会收获更深的快乐。",
  },
  {
    code: "-+-+", number: 6, id: "go-with-it", name: "随缘玩家", english: "GO WITH IT",
    species: "绿头鸭", speciesEnglish: "Mallard", image: "/birds-v3/go-with-it.jpg", accent: "#126aa5",
    tagline: "水流去哪，我就去哪看看",
    traits: ["适应力强", "松弛感", "好相处"],
    body: "你很会顺着环境找到舒服的水流，变化很少让你慌张。你相信体验会带来答案，也擅长用平常心看待意外。和你同行，行程常常轻松又充满惊喜。",
    birdNote: "绿头鸭是分布最广的野鸭之一，从城市公园到野外湖泊都住得惯。我们熟悉的家鸭，大多就是由它驯化而来。",
    watchOut: "随缘之外，也记得为真正在乎的事认真争取一次。",
  },
  {
    code: "-++-", number: 7, id: "care-pack", name: "暖心管家", english: "CARE PACK",
    species: "家燕", speciesEnglish: "Barn Swallow", image: "/birds-v3/care-pack.jpg", accent: "#d4521c",
    tagline: "记得每个人的需要，也记得回家的路",
    traits: ["体贴", "可靠", "有温度"],
    body: "你对身边人的状态有天然雷达，总能留意到那些还没说出口的需要。温柔在你这里带着行动力：递上一杯水、补好一个缺口、记住一件小事。你让身边的人拥有被照顾的踏实感。",
    birdNote: "家燕喜欢在屋檐下用泥巴筑巢，不少家燕第二年还会回到同一个地方。养育雏鸟时，燕子爸妈会轮流来回喂食。",
    watchOut: "照顾别人之前，也把自己放进需要被照顾的名单里。",
  },
  {
    code: "-+++", number: 8, id: "team-mode", name: "组队党", english: "TEAM MODE",
    species: "斑嘴鸭", speciesEnglish: "Eastern Spot-billed Duck", image: "/birds-v3/team-mode.jpg", accent: "#3f6f22",
    tagline: "一个人走得快，一群人走得稳",
    traits: ["合作型", "有条理", "讲默契"],
    body: "你喜欢和伙伴共享路线、发现与笑声，也愿意为大家把事情理顺。对你来说，一群人彼此照应、按计划推进，旅程才更踏实。你善于融入协作，也会自然地维护团队的默契。",
    birdNote: "斑嘴鸭的嘴尖有一块醒目的黄斑，很好认。小鸭破壳后不久，就会排成一队跟着妈妈下水。",
    watchOut: "团队很重要，偶尔也给自己留一点独处和任性的空间。",
  },
  {
    code: "+---", number: 9, id: "action-first", name: "冲锋选手", english: "ACTION FIRST",
    species: "普通鸬鹚", speciesEnglish: "Great Cormorant", image: "/birds-v3/action-first.jpg", accent: "#38651f",
    tagline: "看准了就扎下去，边游边想",
    traits: ["果断", "行动派", "敢试错"],
    body: "你对机会的反应很快，想到就愿意下水试一试。行动会帮你整理思路，真实的感受也比长时间犹豫更能给你答案。你的果断经常为身边的人打开第一条路。",
    birdNote: "鸬鹚是潜水捕鱼的好手。它的羽毛不像鸭子那样防水，所以上岸后常常张开翅膀，把自己晾干。",
    watchOut: "冲之前花三秒确认方向，能少走不少弯路。",
  },
  {
    code: "+--+", number: 10, id: "main-character", name: "湖边显眼包", english: "MAIN CHARACTER",
    species: "白鹤", speciesEnglish: "Siberian Crane", image: "/birds-v3/main-character.jpg", accent: "#7e4b91",
    tagline: "不用刻意，走到哪都是画面中心",
    traits: ["有主见", "表现力", "独一份"],
    body: "你拥有很强的现场存在感，想到就做，也有自己清楚的判断标准。你不太在意随大流，更愿意用自己的方式留下鲜明印记。你给平常时刻加上了值得记住的高光。",
    birdNote: "白鹤脸上那块红色是裸露的皮肤，不是羽毛。全世界绝大多数白鹤冬天都飞到鄱阳湖越冬，它是极危物种，也是国家一级重点保护野生动物，每年都被无数镜头追着拍。",
    watchOut: "你的光很亮，也记得给身边人留一点发光的位置。",
  },
  {
    code: "+-+-", number: 11, id: "nailed-it", name: "拿捏大师", english: "NAILED IT",
    species: "普通翠鸟", speciesEnglish: "Common Kingfisher", image: "/birds-v3/nailed-it.jpg", accent: "#1769a3",
    tagline: "一击即中，靠的是安静的观察",
    traits: ["专注", "精准", "高效"],
    body: "你出手利落，背后却有细致的观察和判断。面对目标时，你会先锁定关键，再用恰到好处的动作完成它，也很在意做出来的东西有没有温度。你的效率来自专注，也来自对时机的敏锐把握。",
    birdNote: "翠鸟会停在水边的枝头盯着水面，发现小鱼就一头扎下去。日本新干线列车的车头设计，就曾从翠鸟的喙获得灵感。",
    watchOut: "不是每件事都要拿捏到满分，留点余地也很好。",
  },
  {
    code: "+-++", number: 12, id: "stock-it-up", name: "囤货狂魔", english: "STOCK IT UP",
    species: "红尾伯劳", speciesEnglish: "Brown Shrike", image: "/birds-v3/stock-it-up.jpg", accent: "#b4561c",
    tagline: "未雨绸缪，是我的安全感来源",
    traits: ["有规划", "务实", "储备型"],
    body: "你喜欢为未来多准备一步，资源、信息和工具都能被你安排得明明白白。你行动快，却从不打无准备之仗；未雨绸缪给你安全感，也让你在关键时刻总有东西可用。你的储备能力，是身边人很实在的底气。",
    birdNote: "伯劳外号“屠夫鸟”：它会把捉到的昆虫挂在树枝或尖刺上存起来，像一个户外食品柜。伯劳通常独来独往，领地意识很强。",
    watchOut: "准备充足很好，偶尔也试试轻装出发的自由。",
  },
  {
    code: "++--", number: 13, id: "hype-buddy", name: "热场达人", english: "HYPE BUDDY",
    species: "红嘴鸥", speciesEnglish: "Black-headed Gull", image: "/birds-v3/hype-buddy.jpg", accent: "#d94f1c",
    tagline: "有我在，场子不会冷",
    traits: ["热情", "感染力", "会接梗"],
    body: "你自带升温能力，常常一句话就能让场子活起来。热情、响应和分享欲让你成为人群里的能量补给站。你喜欢大家一起进入状态，也享受每一次快乐的回声。",
    birdNote: "红嘴鸥总是成群活动，叫声响亮。每年冬天都有大批红嘴鸥飞到昆明越冬，成了城市里的明星访客。",
    watchOut: "热闹之后，也给自己留一段安静的回血时间。",
  },
  {
    code: "++-+", number: 14, id: "instant-bestie", name: "社牛搭子", english: "INSTANT BESTIE",
    species: "树麻雀", speciesEnglish: "Eurasian Tree Sparrow", image: "/birds-v3/instant-bestie.jpg", accent: "#c4570f",
    tagline: "三句话之内，路人变朋友",
    traits: ["自来熟", "机灵", "信息灵通"],
    body: "你很容易越过陌生感，快速找到和别人相处的共同频道。你愿意发起对话、交换情报、临时组队，也常把路人变成同行伙伴。你的开放让世界显得格外热闹。",
    birdNote: "城市里最常见的麻雀就是树麻雀。它们几乎总是成群出现，很会在人类生活的地方找吃的、找住处。",
    watchOut: "朋友很多，也别忘了经营几段能说心里话的关系。",
  },
  {
    code: "+++-", number: 15, id: "squad-leader", name: "领队大哥", english: "SQUAD LEADER",
    species: "鸿雁", speciesEnglish: "Swan Goose", image: "/birds-v3/squad-leader.jpg", accent: "#155993",
    tagline: "我在前面开路，你们跟上就好",
    traits: ["担当", "号召力", "照顾队伍"],
    body: "你在行动中会自然地关注方向与队伍状态。目标明确时，你愿意承担责任、协调节奏，也会留意每个人有没有跟上。你的带领很有感染力，让同行的人更敢向前。",
    birdNote: "鸿雁就是人们常说的大雁之一，中国家鹅大多由它驯化而来。迁徙时雁群常排成“人”字或“一”字，后面的雁借助前面同伴翼尖带起的气流省力，领头的位置也会轮换。",
    watchOut: "带队累了的时候，也可以把领头的位置让出来歇一歇。",
  },
  {
    code: "++++", number: 16, id: "foodie-champ", name: "干饭狠人", english: "FOODIE CHAMP",
    species: "白琵鹭", speciesEnglish: "Eurasian Spoonbill", image: "/birds-v3/foodie-champ.jpg", accent: "#3d6a27",
    tagline: "认真吃饭，认真做事，效率拉满",
    traits: ["目标感", "执行力", "会享受"],
    body: "你对喜欢的事投入直接又专注，认真享受也认真完成。清晰的目标会迅速调动你的能量，你也很乐意拉上大家一起干、一起吃。你用充足的行动力，把小事做出专业范儿。",
    birdNote: "白琵鹭的嘴像一把扁扁的汤勺。它们常成群在浅水里边走边左右扫动嘴巴，一碰到小鱼小虾就立刻夹住。",
    watchOut: "冲刺之余，也给身体和心情留出“消化时间”。",
  },
];

export const BIRDS: Record<string, BirdType> = Object.fromEntries(BIRD_TYPES.map((bird) => [bird.code, bird]));
export const BIRDS_BY_ID: Record<string, BirdType> = Object.fromEntries(BIRD_TYPES.map((bird) => [bird.id, bird]));

export function birdImage(id: string, width: 480 | 960 = 480) {
  return assetUrl(`/birds-v3/web/${id}-${width}.webp`);
}

/** 相邻题目交替正反顺序显示，避免“总选 A”就能得到固定结果。 */
export function displayOptions(index: number) {
  const options = QUESTIONS[index].options;
  return (Math.floor(index / 4) + index) % 2 === 1 ? [...options].reverse() : options;
}

export function scoreQuiz(answers: readonly number[]): QuizOutcome {
  const axes = AXES.map((axis) => {
    let score = 0;
    let max = 0;
    let lastAnswer = 0;

    QUESTIONS.forEach((question, index) => {
      if (question.axis !== axis.id) return;
      const answer = answers[index] ?? 0;
      score += answer;
      max += 2;
      if (answer !== 0) lastAnswer = answer;
    });

    // 平局时，以这一维度最后作答的那道题为准。
    const pole: Pole = score > 0 || (score === 0 && lastAnswer >= 0) ? "+" : "-";
    const strength = Math.round(50 + (Math.abs(score) / max) * 50);
    return { axis, score, max, pole, strength };
  });

  const code = axes.map((result) => result.pole).join("");
  return { code, bird: BIRDS[code], axes };
}

/** 最佳搭子：社交电量和决策关注相同，行动节奏和计划偏好互补。 */
export function partnerOf(bird: BirdType) {
  const flip = (pole: string) => (pole === "+" ? "-" : "+");
  const [pace, social, structure, focus] = bird.code;
  return BIRDS[`${flip(pace)}${social}${flip(structure)}${focus}`];
}

export function partnerReason(bird: BirdType) {
  const [pace, , structure] = bird.code;
  const paceLine = pace === "+" ? "你负责起飞，TA 帮你看清方向" : "TA 带你起飞，你帮 TA 看清方向";
  const planLine = structure === "+" ? "你定好航线，TA 带来意外的风景" : "你带来意外的风景，TA 定好航线";
  return `你们的社交电量和在意的东西很像，做事方式却刚好互补：${paceLine}；${planLine}。`;
}
