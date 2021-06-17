const Discord = require("discord.js");
const global_prefix = "!";
const ytdl = require("ytdl-core");
const YOUTUBE_API = (process.env.YOUTUBE_API)
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: YOUTUBE_API,
    type: 'video'
};

const guild_prefixes = {}
const YouTube = require("simple-youtube-api");
const streamOptions = { seek: 0, volume: 1 };
const { getInfo } = require('ytdl-getinfo');
const urban = require("urban");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
var version = '1.2';
var servers = {};
let xp = require("./xp.json");
const fs = require("fs");
const money = require("./money.json");
const ms = require("parse-ms");
const cheerio = require("cheerio");
const request = require("request");
const { Random } = require("something-random-on-discord");
const random = new Random();
const mongo = require('./commands/mongo')
const imjokeSchema = require("./schemas/imjoke-schema");
const commandPrefixSchema = require("./schemas/prefix-schema")
const Data = require("./schemas/data")

const inviteNotifications = require('./commands/invite-notifications');

const cooldowns = require("./cooldowns.json");
const Client = new Discord.Client({ disableMentions: 'everyone' });


Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        console.log("Couldn't find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        Client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            Client.aliases.set(alias, props.help.name);
        })
    })
})






Client.on('ready', async ()=>{
    console.log("Bot is online.");
    Client.user.setActivity('with my guitar | use "!help"');
    
    inviteNotifications(Client)
    
    await mongo().then(async mongoose => {
        try {
            for (const guild of Client.guilds.cache){
                const guildId = guild[1].id
                const result = await commandPrefixSchema.findOne({_id: guildId})
                if(result){
                    guild_prefixes[guildId] = result.prefix
                }
            }

            console.log(guild_prefixes)

        } finally{
            mongoose.connection.close()
        }

    })
    
    answered = true;
    cAnswer = "";
    userAnswer = "";
    
    fridaycooldown = true;
    
    ringoffirecooldown = true;
    
    rpsAnswered = true;
    rpsAnswer = "";
    rpsUserAnswer = "";
    
    debounce = true;
    
    bookwormAnswered = true;
    bookwormAnswer = "";
    bookwormAnswer2 = "";
    
    answersCorrect = 0;
    
    botCanAnswer = true;
    
    words = [
        'ability',
        'absence',
        'academy',
        'account',
        'accused',
        'achieve',
        'acquire',
        'address',
        'advance',
        'adverse',
        'advised',
        'adviser',
        'against',
        'airline',
        'airport',
        'alcohol',
        'alleged',
        'already',
        'analyst',
        'ancient',
        'another',
        'anxiety',
        'anxious',
        'anybody',
        'applied',
        'arrange',
        'arrival',
        'article',
        'assault',
        'assumed',
        'assured',
        'attempt',
        'attract',
        'auction',
        'average',
        'backing',
        'balance',
        'banking',
        'barrier',
        'battery',
        'bearing',
        'beating',
        'because',
        'bedroom',
        'believe',
        'beneath',
        'benefit',
        'besides',
        'between',
        'billion',
        'binding',
        'brother',
        'brought',
        'burning',
        'cabinet',
        'caliber',
        'calling',
        'capable',
        'capital',
        'captain',
        'caption',
        'capture',
        'careful',
        'carrier',
        'caution',
        'ceiling',
        'central',
        'centric',
        'century',
        'certain',
        'chamber',
        'channel',
        'chapter',
        'charity',
        'charlie',
        'charter',
        'checked',
        'chicken',
        'chronic',
        'circuit',
        'classes',
        'classic',
        'climate',
        'closing',
        'closure',
        'clothes',
        'collect',
        'college',
        'combine',
        'comfort',
        'command',
        'comment',
        'compact',
        'company',
        'compare',
        'compete',
        'complex',
        'concept',
        'concern',
        'concert',
        'conduct',
        'confirm',
        'connect',
        'consent',
        'consist',
        'contact',
        'contain',
        'content',
        'contest',
        'context',
        'control',
        'convert',
        'correct',
        'council',
        'counsel',
        'counter',
        'country',
        'crucial',
        'crystal',
        'culture',
        'current',
        'cutting',
        'dealing',
        'decided',
        'decline',
        'default',
        'defence',
        'deficit',
        'deliver',
        'density',
        'deposit',
        'desktop',
        'despite',
        'destroy',
        'develop',
        'devoted',
        'diamond',
        'digital',
        'discuss',
        'disease',
        'display',
        'dispute',
        'distant',
        'diverse',
        'divided',
        'drawing',
        'driving',
        'dynamic',
        'eastern',
        'economy',
        'edition',
        'elderly',
        'element',
        'engaged',
        'enhance',
        'essence',
        'evening',
        'evident',
        'exactly',
        'examine',
        'example',
        'excited',
        'exclude',
        'exhibit',
        'expense',
        'explain',
        'explore',
        'express',
        'extreme',
        'factory',
        'faculty',
        'failing',
        'failure',
        'fashion',
        'feature',
        'federal',
        'feeling',
        'fiction',
        'fifteen',
        'filling',
        'finance',
        'finding',
        'fishing',
        'fitness',
        'foreign',
        'forever',
        'formula',
        'fortune',
        'forward',
        'founder',
        'freedom',
        'further',
        'gallery',
        'gateway',
        'general',
        'genetic',
        'genuine',
        'gigabit',
        'greater',
        'hanging',
        'heading',
        'healthy',
        'hearing',
        'heavily',
        'helpful',
        'helping',
        'herself',
        'highway',
        'himself',
        'history',
        'holding',
        'holiday',
        'housing',
        'however',
        'hundred',
        'husband',
        'illegal',
        'illness',
        'imagine',
        'imaging',
        'improve',
        'include',
        'initial',
        'inquiry',
        'insight',
        'install',
        'instant',
        'instead',
        'intense',
        'interim',
        'involve',
        'jointly',
        'journal',
        'journey',
        'justice',
        'justify',
        'keeping',
        'killing',
        'kingdom',
        'kitchen',
        'knowing',
        'landing',
        'largely',
        'lasting',
        'leading',
        'learned',
        'leisure',
        'liberal',
        'liberty',
        'library',
        'license',
        'limited',
        'listing',
        'logical',
        'loyalty',
        'machine',
        'manager',
        'married',
        'massive',
        'maximum',
        'meaning',
        'measure',
        'medical',
        'meeting',
        'mention',
        'message',
        'million',
        'mineral',
        'minimal',
        'minimum',
        'missing',
        'mission',
        'mistake',
        'mixture',
        'monitor',
        'monthly',
        'morning',
        'musical',
        'mystery',
        'natural',
        'neither',
        'nervous',
        'network',
        'neutral',
        'notable',
        'nothing',
        'nowhere',
        'nuclear',
        'nursing',
        'obvious',
        'offense',
        'officer',
        'ongoing',
        'opening',
        'operate',
        'opinion',
        'optical',
        'organic',
        'outcome',
        'outdoor',
        'outlook',
        'outside',
        'overall',
        'pacific',
        'package',
        'painted',
        'parking',
        'partial',
        'partner',
        'passage',
        'passing',
        'passion',
        'passive',
        'patient',
        'pattern',
        'payable',
        'payment',
        'penalty',
        'pending',
        'pension',
        'percent',
        'perfect',
        'perform',
        'perhaps',
        'phoenix',
        'picking',
        'picture',
        'pioneer',
        'plastic',
        'pointed',
        'popular',
        'portion',
        'poverty',
        'precise',
        'predict',
        'premier',
        'premium',
        'prepare',
        'present',
        'prevent',
        'primary',
        'printer',
        'privacy',
        'private',
        'problem',
        'proceed',
        'process',
        'produce',
        'product',
        'profile',
        'program',
        'project',
        'promise',
        'promote',
        'protect',
        'protein',
        'protest',
        'provide',
        'publish',
        'purpose',
        'pushing',
        'qualify',
        'quality',
        'quarter',
        'radical',
        'railway',
        'readily',
        'Reading',
        'reality',
        'realize',
        'receipt',
        'receive',
        'recover',
        'reflect',
        'regular',
        'related',
        'release',
        'remains',
        'removal',
        'removed',
        'replace',
        'request',
        'require',
        'reserve',
        'resolve',
        'respect',
        'respond',
        'restore',
        'retired',
        'revenue',
        'reverse',
        'rollout',
        'routine',
        'running',
        'satisfy',
        'science',
        'section',
        'segment',
        'serious',
        'service',
        'serving',
        'session',
        'setting',
        'seventh',
        'several',
        'shortly',
        'showing',
        'silence',
        'silicon',
        'similar',
        'sitting',
        'sixteen',
        'skilled',
        'smoking',
        'society',
        'somehow',
        'someone',
        'speaker',
        'special',
        'species',
        'sponsor',
        'station',
        'storage',
        'strange',
        'stretch',
        'student',
        'studied',
        'subject',
        'succeed',
        'success',
        'suggest',
        'summary',
        'support',
        'suppose',
        'supreme',
        'surface',
        'surgery',
        'surplus',
        'survive',
        'suspect',
        'sustain',
        'teacher',
        'telecom',
        'telling',
        'tension',
        'theatre',
        'therapy',
        'thereby',
        'thought',
        'through',
        'tonight',
        'totally',
        'touched',
        'towards',
        'traffic',
        'trouble',
        'turning',
        'typical',
        'uniform',
        'unknown',
        'unusual',
        'upgrade',
        'upscale',
        'utility',
        'variety',
        'various',
        'vehicle',
        'venture',
        'version',
        'veteran',
        'victory',
        'viewing',
        'village',
        'violent',
        'virtual',
        'visible',
        'waiting',
        'walking',
        'wanting',
        'warning',
        'warrant',
        'wearing',
        'weather',
        'webcast',
        'website',
        'wedding',
        'weekend',
        'welcome',
        'welfare',
        'western',
        'whereas',
        'whereby',
        'whether',
        'willing',
        'winning',
        'without',
        'witness',
        'working',
        'writing',
        'written',
        'abroad',
        'accept',
        'access',
        'across',
        'acting',
        'action',
        'active',
        'actual',
        'advice',
        'advise',
        'affect',
        'afford',
        'afraid',
        'agency',
        'agenda',
        'almost',
        'always',
        'amount',
        'animal',
        'annual',
        'answer',
        'anyone',
        'anyway',
        'appeal',
        'appear',
        'around',
        'arrive',
        'artist',
        'aspect',
        'assess',
        'assist',
        'assume',
        'attack',
        'attend',
        'august',
        'author',
        'avenue',
        'backed',
        'barely',
        'battle',
        'beauty',
        'became',
        'become',
        'before',
        'behalf',
        'behind',
        'belief',
        'belong',
        'berlin',
        'better',
        'beyond',
        'bishop',
        'border',
        'bottle',
        'bottom',
        'bought',
        'branch',
        'breath',
        'bridge',
        'bright',
        'broken',
        'budget',
        'burden',
        'bureau',
        'button',
        'camera',
        'cancer',
        'cannot',
        'carbon',
        'career',
        'castle',
        'casual',
        'caught',
        'center',
        'centre',
        'chance',
        'change',
        'charge',
        'cheese',
        'choice',
        'choose',
        'chosen',
        'church',
        'circle',
        'client',
        'closed',
        'closer',
        'coffee',
        'column',
        'combat',
        'coming',
        'common',
        'comply',
        'copper',
        'corner',
        'costly',
        'county',
        'couple',
        'course',
        'covers',
        'create',
        'credit',
        'crisis',
        'custom',
        'damage',
        'danger',
        'dealer',
        'debate',
        'decade',
        'decide',
        'defeat',
        'defend',
        'define',
        'degree',
        'demand',
        'depend',
        'deputy',
        'desert',
        'design',
        'desire',
        'detail',
        'detect',
        'device',
        'differ',
        'dinner',
        'direct',
        'doctor',
        'dollar',
        'domain',
        'double',
        'driven',
        'driver',
        'during',
        'easily',
        'eating',
        'editor',
        'effect',
        'effort',
        'eighth',
        'either',
        'eleven',
        'emerge',
        'empire',
        'employ',
        'enable',
        'ending',
        'energy',
        'engage',
        'engine',
        'enough',
        'ensure',
        'entire',
        'entity',
        'equity',
        'escape',
        'estate',
        'ethnic',
        'exceed',
        'except',
        'excess',
        'expand',
        'expect',
        'expert',
        'export',
        'extend',
        'extent',
        'fabric',
        'facing',
        'factor',
        'failed',
        'fairly',
        'fallen',
        'family',
        'famous',
        'father',
        'fellow',
        'female',
        'figure',
        'filing',
        'finger',
        'finish',
        'fiscal',
        'flight',
        'flying',
        'follow',
        'forced',
        'forest',
        'forget',
        'formal',
        'format',
        'former',
        'foster',
        'fought',
        'fourth',
        'french',
        'friend',
        'future',
        'garden',
        'gather',
        'gender',
        'german',
        'global',
        'golden',
        'ground',
        'growth',
        'guilty',
        'handed',
        'handle',
        'happen',
        'hardly',
        'headed',
        'health',
        'height',
        'hidden',
        'holder',
        'honest',
        'impact',
        'import',
        'income',
        'indeed',
        'injury',
        'inside',
        'intend',
        'intent',
        'invest',
        'island',
        'itself',
        'jersey',
        'joseph',
        'junior',
        'killed',
        'labour',
        'latest',
        'latter',
        'launch',
        'lawyer',
        'leader',
        'league',
        'leaves',
        'legacy',
        'length',
        'lesson',
        'letter',
        'lights',
        'likely',
        'linked',
        'liquid',
        'listen',
        'little',
        'living',
        'losing',
        'lucent',
        'luxury',
        'mainly',
        'making',
        'manage',
        'manner',
        'manual',
        'margin',
        'marine',
        'marked',
        'market',
        'martin',
        'master',
        'matter',
        'mature',
        'medium',
        'member',
        'memory',
        'mental',
        'merely',
        'merger',
        'method',
        'middle',
        'miller',
        'mining',
        'minute',
        'mirror',
        'mobile',
        'modern',
        'modest',
        'module',
        'moment',
        'morris',
        'mostly',
        'mother',
        'motion',
        'moving',
        'murder',
        'museum',
        'mutual',
        'myself',
        'narrow',
        'nation',
        'native',
        'nature',
        'nearby',
        'nearly',
        'nights',
        'nobody',
        'normal',
        'notice',
        'notion',
        'number',
        'object',
        'obtain',
        'office',
        'offset',
        'online',
        'option',
        'orange',
        'origin',
        'output',
        'oxford',
        'packed',
        'palace',
        'parent',
        'partly',
        'patent',
        'people',
        'period',
        'permit',
        'person',
        'phrase',
        'picked',
        'planet',
        'player',
        'please',
        'plenty',
        'pocket',
        'police',
        'policy',
        'prefer',
        'pretty',
        'prince',
        'prison',
        'profit',
        'proper',
        'proven',
        'public',
        'pursue',
        'raised',
        'random',
        'rarely',
        'rather',
        'rating',
        'reader',
        'really',
        'reason',
        'recall',
        'recent',
        'record',
        'reduce',
        'reform',
        'regard',
        'regime',
        'region',
        'relate',
        'relief',
        'remain',
        'remote',
        'remove',
        'repair',
        'repeat',
        'replay',
        'report',
        'rescue',
        'resort',
        'result',
        'retail',
        'retain',
        'return',
        'reveal',
        'review',
        'reward',
        'riding',
        'rising',
        'robust',
        'ruling',
        'safety',
        'salary',
        'sample',
        'saving',
        'saying',
        'scheme',
        'school',
        'screen',
        'search',
        'season',
        'second',
        'secret',
        'sector',
        'secure',
        'seeing',
        'select',
        'seller',
        'senior',
        'series',
        'server',
        'settle',
        'severe',
        'sexual',
        'should',
        'signal',
        'signed',
        'silent',
        'silver',
        'simple',
        'simply',
        'single',
        'sister',
        'slight',
        'smooth',
        'social',
        'solely',
        'sought',
        'source',
        'soviet',
        'speech',
        'spirit',
        'spoken',
        'spread',
        'spring',
        'square',
        'stable',
        'status',
        'steady',
        'stolen',
        'strain',
        'stream',
        'street',
        'stress',
        'strict',
        'strike',
        'string',
        'strong',
        'struck',
        'studio',
        'submit',
        'sudden',
        'suffer',
        'summer',
        'summit',
        'supply',
        'surely',
        'survey',
        'switch',
        'symbol',
        'system',
        'taking',
        'talent',
        'target',
        'taught',
        'tenant',
        'tender',
        'tennis',
        'thanks',
        'theory',
        'thirty',
        'though',
        'threat',
        'thrown',
        'ticket',
        'timely',
        'timing',
        'tissue',
        'toward',
        'travel',
        'treaty',
        'trying',
        'twelve',
        'twenty',
        'unable',
        'unique',
        'united',
        'unless',
        'unlike',
        'update',
        'useful',
        'valley',
        'varied',
        'vendor',
        'versus',
        'victim',
        'vision',
        'visual',
        'volume',
        'walker',
        'wealth',
        'weekly',
        'weight',
        'wholly',
        'window',
        'winner',
        'winter',
        'within',
        'wonder',
        'worker',
        'wright',
        'writer',
        'yellow',
        'about',
        'above',
        'abuse',
        'actor',
        'acute',
        'admit',
        'adopt',
        'adult',
        'after',
        'again',
        'agent',
        'agree',
        'ahead',
        'alarm',
        'album',
        'alert',
        'alike',
        'alive',
        'allow',
        'alone',
        'along',
        'alter',
        'among',
        'anger',
        'angle',
        'angry',
        'apart',
        'apple',
        'apply',
        'arena',
        'argue',
        'arise',
        'array',
        'aside',
        'asset',
        'audio',
        'audit',
        'avoid',
        'award',
        'aware',
        'badly',
        'baker',
        'bases',
        'basic',
        'basis',
        'beach',
        'began',
        'begin',
        'begun',
        'being',
        'below',
        'bench',
        'billy',
        'birth',
        'black',
        'blame',
        'blind',
        'block',
        'blood',
        'board',
        'boost',
        'booth',
        'bound',
        'brain',
        'brand',
        'bread',
        'break',
        'breed',
        'brief',
        'bring',
        'broad',
        'broke',
        'brown',
        'build',
        'built',
        'buyer',
        'cable',
        'calif',
        'carry',
        'catch',
        'cause',
        'chain',
        'chair',
        'chart',
        'chase',
        'cheap',
        'check',
        'chest',
        'chief',
        'child',
        'china',
        'chose',
        'civil',
        'claim',
        'class',
        'clean',
        'clear',
        'click',
        'clock',
        'close',
        'coach',
        'coast',
        'could',
        'count',
        'court',
        'cover',
        'craft',
        'crash',
        'cream',
        'crime',
        'cross',
        'crowd',
        'crown',
        'curve',
        'cycle',
        'daily',
        'dance',
        'dated',
        'dealt',
        'death',
        'debut',
        'delay',
        'depth',
        'doing',
        'doubt',
        'dozen',
        'draft',
        'drama',
        'drawn',
        'dream',
        'dress',
        'drill',
        'drink',
        'drive',
        'drove',
        'dying',
        'eager',
        'early',
        'earth',
        'eight',
        'elite',
        'empty',
        'enemy',
        'enjoy',
        'enter',
        'entry',
        'equal',
        'error',
        'event',
        'every',
        'exact',
        'exist',
        'extra',
        'faith',
        'false',
        'fault',
        'fiber',
        'field',
        'fifth',
        'fifty',
        'fight',
        'final',
        'first',
        'fixed',
        'flash',
        'fleet',
        'floor',
        'fluid',
        'focus',
        'force',
        'forth',
        'forty',
        'forum',
        'found',
        'frame',
        'frank',
        'fraud',
        'fresh',
        'front',
        'fruit',
        'fully',
        'funny',
        'giant',
        'given',
        'glass',
        'globe',
        'going',
        'grace',
        'grade',
        'grand',
        'grant',
        'grass',
        'great',
        'green',
        'gross',
        'group',
        'grown',
        'guard',
        'guess',
        'guest',
        'guide',
        'happy',
        'harry',
        'heart',
        'heavy',
        'hence',
        'henry',
        'horse',
        'hotel',
        'house',
        'human',
        'ideal',
        'image',
        'index',
        'inner',
        'input',
        'issue',
        'japan',
        'jimmy',
        'joint',
        'jones',
        'judge',
        'known',
        'label',
        'large',
        'laser',
        'later',
        'laugh',
        'layer',
        'learn',
        'lease',
        'least',
        'leave',
        'legal',
        'level',
        'lewis',
        'light',
        'limit',
        'links',
        'lives',
        'local',
        'logic',
        'loose',
        'lower',
        'lucky',
        'lunch',
        'lying',
        'magic',
        'major',
        'maker',
        'march',
        'maria',
        'match',
        'maybe',
        'mayor',
        'meant',
        'media',
        'metal',
        'might',
        'minor',
        'minus',
        'mixed',
        'model',
        'money',
        'month',
        'moral',
        'motor',
        'mount',
        'mouse',
        'mouth',
        'movie',
        'music',
        'needs',
        'never',
        'newly',
        'night',
        'noise',
        'north',
        'noted',
        'novel',
        'nurse',
        'occur',
        'ocean',
        'offer',
        'often',
        'order',
        'other',
        'ought',
        'paint',
        'panel',
        'paper',
        'party',
        'peace',
        'peter',
        'phase',
        'phone',
        'photo',
        'piece',
        'pilot',
        'pitch',
        'place',
        'plain',
        'plane',
        'plant',
        'plate',
        'point',
        'pound',
        'power',
        'press',
        'price',
        'pride',
        'prime',
        'print',
        'prior',
        'prize',
        'proof',
        'proud',
        'prove',
        'queen',
        'quick',
        'quiet',
        'quite',
        'radio',
        'raise',
        'range',
        'rapid',
        'ratio',
        'reach',
        'ready',
        'refer',
        'right',
        'rival',
        'river',
        'robin',
        'roger',
        'roman',
        'rough',
        'round',
        'route',
        'royal',
        'rural',
        'scale',
        'scene',
        'scope',
        'score',
        'sense',
        'serve',
        'seven',
        'shall',
        'shape',
        'share',
        'sharp',
        'sheet',
        'shelf',
        'shell',
        'shift',
        'shirt',
        'shock',
        'shoot',
        'short',
        'shown',
        'sight',
        'since',
        'sixth',
        'sixty',
        'sized',
        'skill',
        'sleep',
        'slide',
        'small',
        'smart',
        'smile',
        'smith',
        'smoke',
        'solid',
        'solve',
        'sorry',
        'sound',
        'south',
        'space',
        'spare',
        'speak',
        'speed',
        'spend',
        'spent',
        'split',
        'spoke',
        'sport',
        'staff',
        'stage',
        'stake',
        'stand',
        'start',
        'state',
        'steam',
        'steel',
        'stick',
        'still',
        'stock',
        'stone',
        'stood',
        'store',
        'storm',
        'story',
        'strip',
        'stuck',
        'study',
        'stuff',
        'style',
        'sugar',
        'suite',
        'super',
        'sweet',
        'table',
        'taken',
        'taste',
        'taxes',
        'teach',
        'teeth',
        'terry',
        'texas',
        'thank',
        'theft',
        'their',
        'theme',
        'there',
        'these',
        'thick',
        'thing',
        'think',
        'third',
        'those',
        'three',
        'threw',
        'throw',
        'tight',
        'times',
        'tired',
        'title',
        'today',
        'topic',
        'total',
        'touch',
        'tough',
        'tower',
        'track',
        'trade',
        'train',
        'treat',
        'trend',
        'trial',
        'tried',
        'tries',
        'truck',
        'truly',
        'trust',
        'truth',
        'twice',
        'under',
        'undue',
        'union',
        'unity',
        'until',
        'upper',
        'upset',
        'urban',
        'usage',
        'usual',
        'valid',
        'value',
        'video',
        'virus',
        'visit',
        'vital',
        'voice',
        'waste',
        'watch',
        'water',
        'wheel',
        'where',
        'which',
        'while',
        'white',
        'whole',
        'whose',
        'woman',
        'women',
        'world',
        'worry',
        'worse',
        'worst',
        'worth',
        'would',
        'wound',
        'write',
        'wrong',
        'wrote',
        'yield',
        'young',
        'youth',
        'able',
        'acid',
        'aged',
        'also',
        'area',
        'army',
        'away',
        'baby',
        'back',
        'ball',
        'band',
        'bank',
        'base',
        'bath',
        'bear',
        'beat',
        'been',
        'beer',
        'bell',
        'belt',
        'best',
        'bill',
        'bird',
        'blow',
        'blue',
        'boat',
        'body',
        'bomb',
        'bond',
        'bone',
        'book',
        'boom',
        'born',
        'boss',
        'both',
        'bowl',
        'bulk',
        'burn',
        'bush',
        'busy',
        'call',
        'calm',
        'came',
        'camp',
        'card',
        'care',
        'case',
        'cash',
        'cast',
        'cell',
        'chat',
        'chip',
        'city',
        'club',
        'coal',
        'coat',
        'code',
        'cold',
        'come',
        'cook',
        'cool',
        'cope',
        'copy',
        'core',
        'cost',
        'crew',
        'crop',
        'dark',
        'data',
        'date',
        'dawn',
        'days',
        'dead',
        'deal',
        'dean',
        'dear',
        'debt',
        'deep',
        'deny',
        'desk',
        'dial',
        'dick',
        'diet',
        'disc',
        'disk',
        'does',
        'done',
        'door',
        'dose',
        'down',
        'draw',
        'drew',
        'drop',
        'drug',
        'dual',
        'duke',
        'dust',
        'duty',
        'each',
        'earn',
        'ease',
        'east',
        'easy',
        'edge',
        'else',
        'even',
        'ever',
        'evil',
        'exit',
        'face',
        'fact',
        'fail',
        'fair',
        'fall',
        'farm',
        'fast',
        'fate',
        'fear',
        'feed',
        'feel',
        'feet',
        'fell',
        'felt',
        'file',
        'fill',
        'film',
        'find',
        'fine',
        'fire',
        'firm',
        'fish',
        'five',
        'flat',
        'flow',
        'food',
        'foot',
        'ford',
        'form',
        'fort',
        'four',
        'free',
        'from',
        'fuel',
        'full',
        'fund',
        'gain',
        'game',
        'gate',
        'gave',
        'gear',
        'gene',
        'gift',
        'girl',
        'give',
        'glad',
        'goal',
        'goes',
        'gold',
        'golf',
        'gone',
        'good',
        'gray',
        'grew',
        'grey',
        'grow',
        'gulf',
        'hair',
        'half',
        'hall',
        'hand',
        'hang',
        'hard',
        'harm',
        'hate',
        'have',
        'head',
        'hear',
        'heat',
        'held',
        'hell',
        'help',
        'here',
        'hero',
        'high',
        'hill',
        'hire',
        'hold',
        'hole',
        'holy',
        'home',
        'hope',
        'host',
        'hour',
        'huge',
        'hung',
        'hunt',
        'hurt',
        'idea',
        'inch',
        'into',
        'iron',
        'item',
        'jack',
        'jane',
        'jean',
        'john',
        'join',
        'jump',
        'jury',
        'just',
        'keen',
        'keep',
        'kent',
        'kept',
        'kick',
        'kill',
        'kind',
        'king',
        'knee',
        'knew',
        'know',
        'lack',
        'lady',
        'laid',
        'lake',
        'land',
        'lane',
        'last',
        'late',
        'lead',
        'left',
        'less',
        'life',
        'lift',
        'like',
        'line',
        'link',
        'list',
        'live',
        'load',
        'loan',
        'lock',
        'logo',
        'long',
        'look',
        'lord',
        'lose',
        'loss',
        'lost',
        'love',
        'luck',
        'made',
        'mail',
        'main',
        'make',
        'male',
        'many',
        'mark',
        'mass',
        'matt',
        'meal',
        'mean',
        'meat',
        'meet',
        'menu',
        'mere',
        'mike',
        'mile',
        'milk',
        'mill',
        'mind',
        'mine',
        'miss',
        'mode',
        'mood',
        'moon',
        'more',
        'most',
        'move',
        'much',
        'must',
        'name',
        'navy',
        'near',
        'neck',
        'need',
        'news',
        'next',
        'nice',
        'nick',
        'nine',
        'none',
        'nose',
        'note',
        'okay',
        'once',
        'only',
        'onto',
        'open',
        'oral',
        'over',
        'pace',
        'pack',
        'page',
        'paid',
        'pain',
        'pair',
        'palm',
        'park',
        'part',
        'pass',
        'past',
        'path',
        'peak',
        'pick',
        'pink',
        'pipe',
        'plan',
        'play',
        'plot',
        'plug',
        'plus',
        'poll',
        'pool',
        'poor',
        'port',
        'post',
        'pull',
        'pure',
        'push',
        'race',
        'rail',
        'rain',
        'rank',
        'rare',
        'rate',
        'read',
        'real',
        'rear',
        'rely',
        'rent',
        'rest',
        'rice',
        'rich',
        'ride',
        'ring',
        'rise',
        'risk',
        'road',
        'rock',
        'role',
        'roll',
        'roof',
        'room',
        'root',
        'rose',
        'rule',
        'rush',
        'ruth',
        'safe',
        'said',
        'sake',
        'sale',
        'salt',
        'same',
        'sand',
        'save',
        'seat',
        'seed',
        'seek',
        'seem',
        'seen',
        'self',
        'sell',
        'send',
        'sent',
        'sept',
        'ship',
        'shop',
        'shot',
        'show',
        'shut',
        'sick',
        'side',
        'sign',
        'site',
        'size',
        'skin',
        'slip',
        'slow',
        'snow',
        'soft',
        'soil',
        'sold',
        'sole',
        'some',
        'song',
        'soon',
        'sort',
        'soul',
        'spot',
        'star',
        'stay',
        'step',
        'stop',
        'such',
        'suit',
        'sure',
        'take',
        'tale',
        'talk',
        'tall',
        'tank',
        'tape',
        'task',
        'team',
        'tech',
        'tell',
        'tend',
        'term',
        'test',
        'text',
        'than',
        'that',
        'them',
        'then',
        'they',
        'thin',
        'this',
        'thus',
        'till',
        'time',
        'tiny',
        'told',
        'toll',
        'tone',
        'tony',
        'took',
        'tool',
        'tour',
        'town',
        'tree',
        'trip',
        'true',
        'tune',
        'turn',
        'twin',
        'type',
        'unit',
        'upon',
        'used',
        'user',
        'vary',
        'vast',
        'very',
        'vice',
        'view',
        'vote',
        'wage',
        'wait',
        'wake',
        'walk',
        'wall',
        'want',
        'ward',
        'warm',
        'wash',
        'wave',
        'ways',
        'weak',
        'wear',
        'week',
        'well',
        'went',
        'were',
        'west',
        'what',
        'when',
        'whom',
        'wide',
        'wife',
        'wild',
        'will',
        'wind',
        'wine',
        'wing',
        'wire',
        'wise',
        'wish',
        'with',
        'wood',
        'word',
        'wore',
        'work',
        'yard',
        'yeah',
        'year',
        'your',
        'zero',
        'zone',
        'aba',
        'abs',
        'ace',
        'act',
        'add',
        'ado',
        'aft',
        'age',
        'ago',
        'aha',
        'aid',
        'aim',
        'air',
        'ala',
        'ale',
        'all',
        'alt',
        'amp',
        'ana',
        'and',
        'ant',
        'any',
        'ape',
        'app',
        'apt',
        'arc',
        'are',
        'ark',
        'arm',
        'art',
        'ash',
        'ask',
        'asp',
        'ass',
        'ate',
        'ave',
        'awe',
        'axe',
        'aye',
        'baa',
        'bad',
        'bag',
        'ban',
        'bar',
        'bat',
        'bay',
        'bed',
        'bee',
        'beg',
        'bel',
        'ben',
        'bet',
        'bid',
        'big',
        'bin',
        'bio',
        'bis',
        'bit',
        'biz',
        'bob',
        'bog',
        'boo',
        'bow',
        'box',
        'boy',
        'bra',
        'bud',
        'bug',
        'bum',
        'bun',
        'bus',
        'but',
        'buy',
        'bye',
        'cab',
        'cad',
        'cam',
        'can',
        'cap',
        'car',
        'cat',
        'chi',
        'cob',
        'cod',
        'col',
        'con',
        'coo',
        'cop',
        'cor',
        'cos',
        'cot',
        'cow',
        'cox',
        'coy',
        'cry',
        'cub',
        'cue',
        'cum',
        'cup',
        'cut',
        'dab',
        'dad',
        'dal',
        'dam',
        'dan',
        'day',
        'dee',
        'def',
        'del',
        'den',
        'dew',
        'did',
        'die',
        'dig',
        'dim',
        'din',
        'dip',
        'dis',
        'doc',
        'doe',
        'dog',
        'don',
        'dot',
        'dry',
        'dub',
        'due',
        'dug',
        'dun',
        'duo',
        'dye',
        'ear',
        'eat',
        'ebb',
        'ecu',
        'eft',
        'egg',
        'ego',
        'elf',
        'elm',
        'emu',
        'end',
        'era',
        'eta',
        'eve',
        'eye',
        'fab',
        'fad',
        'fan',
        'far',
        'fat',
        'fax',
        'fay',
        'fed',
        'fee',
        'fen',
        'few',
        'fig',
        'fin',
        'fir',
        'fit',
        'fix',
        'flu',
        'fly',
        'foe',
        'fog',
        'for',
        'fox',
        'fry',
        'fun',
        'fur',
        'gag',
        'gal',
        'gap',
        'gas',
        'gay',
        'gee',
        'gel',
        'gem',
        'get',
        'gig',
        'gin',
        'god',
        'got',
        'gum',
        'gun',
        'gut',
        'guy',
        'gym',
        'had',
        'ham',
        'has',
        'hat',
        'hay',
        'hem',
        'hen',
        'her',
        'hey',
        'hid',
        'him',
        'hip',
        'his',
        'hit',
        'hog',
        'hon',
        'hop',
        'hot',
        'how',
        'hub',
        'hue',
        'hug',
        'huh',
        'hum',
        'hut',
        'ice',
        'icy',
        'igg',
        'ill',
        'imp',
        'ink',
        'inn',
        'ion',
        'its',
        'ivy',
        'jam',
        'jar',
        'jaw',
        'jay',
        'jet',
        'jew',
        'job',
        'joe',
        'jog',
        'joy',
        'jug',
        'jun',
        'kay',
        'ken',
        'key',
        'kid',
        'kin',
        'kit',
        'lab',
        'lac',
        'lad',
        'lag',
        'lam',
        'lap',
        'law',
        'lax',
        'lay',
        'lea',
        'led',
        'lee',
        'leg',
        'les',
        'let',
        'lib',
        'lid',
        'lie',
        'lip',
        'lit',
        'log',
        'lot',
        'low',
        'mac',
        'mad',
        'mag',
        'man',
        'map',
        'mar',
        'mas',
        'mat',
        'max',
        'may',
        'med',
        'meg',
        'men',
        'met',
        'mid',
        'mil',
        'mix',
        'mob',
        'mod',
        'mol',
        'mom',
        'mon',
        'mop',
        'mot',
        'mud',
        'mug',
        'mum',
        'nab',
        'nah',
        'nan',
        'nap',
        'nay',
        'neb',
        'neg',
        'net',
        'new',
        'nil',
        'nip',
        'nod',
        'nor',
        'nos',
        'not',
        'now',
        'nun',
        'nut',
        'oak',
        'odd',
        'off',
        'oft',
        'oil',
        'old',
        'ole',
        'one',
        'ooh',
        'opt',
        'orb',
        'ore',
        'our',
        'out',
        'owe',
        'owl',
        'own',
        'pac',
        'pad',
        'pal',
        'pam',
        'pan',
        'pap',
        'par',
        'pas',
        'pat',
        'paw',
        'pay',
        'pea',
        'peg',
        'pen',
        'pep',
        'per',
        'pet',
        'pew',
        'phi',
        'pic',
        'pie',
        'pig',
        'pin',
        'pip',
        'pit',
        'ply',
        'pod',
        'pol',
        'pop',
        'pot',
        'pro',
        'psi',
        'pub',
        'pup',
        'put',
        'rad',
        'rag',
        'raj',
        'ram',
        'ran',
        'rap',
        'rat',
        'raw',
        'ray',
        'red',
        'ref',
        'reg',
        'rem',
        'rep',
        'rev',
        'rib',
        'rid',
        'rig',
        'rim',
        'rip',
        'rob',
        'rod',
        'roe',
        'rot',
        'row',
        'rub',
        'rue',
        'rug',
        'rum',
        'run',
        'rye',
        'sab',
        'sac',
        'sad',
        'sae',
        'sag',
        'sal',
        'sap',
        'sat',
        'saw',
        'say',
        'sea',
        'sec',
        'see',
        'sen',
        'set',
        'sew',
        'sex',
        'she',
        'shy',
        'sic',
        'sim',
        'sin',
        'sip',
        'sir',
        'sis',
        'sit',
        'six',
        'ski',
        'sky',
        'sly',
        'sod',
        'sol',
        'son',
        'sow',
        'soy',
        'spa',
        'spy',
        'sub',
        'sue',
        'sum',
        'sun',
        'sup',
        'tab',
        'tad',
        'tag',
        'tam',
        'tan',
        'tap',
        'tar',
        'tat',
        'tax',
        'tea',
        'ted',
        'tee',
        'ten',
        'the',
        'thy',
        'tie',
        'tin',
        'tip',
        'tit',
        'tod',
        'toe',
        'tom',
        'ton',
        'too',
        'top',
        'tor',
        'tot',
        'tow',
        'toy',
        'try',
        'tub',
        'tug',
        'two',
        'use',
        'van',
        'vat',
        'vet',
        'via',
        'vie',
        'vow',
        'wan',
        'war',
        'was',
        'wax',
        'way',
        'web',
        'wed',
        'wee',
        'wet',
        'who',
        'why',
        'wig',
        'win',
        'wis',
        'wit',
        'won',
        'woo',
        'wow',
        'wry',
        'wye',
        'yen',
        'yep',
        'yes',
        'yet',
        'you',
        'zip',
        'zoo',
                    
                    ];
})


Client.on('guildMemberAdd', (member) =>{

    const channel = member.guild.channels.cache.find(channel => channel.name === "general");
    if(!channel) return;

});

Client.on('guildMemberRemove', member =>{
    const channel = member.guild.systemChannel
    if(!channel) return;
    
    

    channel.send(`Oh no! ${member.user.username}#${member.user.discriminator} left the server! Their dignity will stay with us forever.`)
});

Client.on('message', async (message)=>{
    if (message.author.bot && botCanAnswer == false) return;


    let channelID = "779827454730698833";
    let guildID = "655808506343063552";
    if(message.channel.type === 'dm'){
        if(message.author.bot) return;
        let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setColor('#FAA')
        .addField('Message:', message.content)
        .setDescription(`User ID: ${message.author.id}`);
        Client.channels.cache.get(channelID).send(embed);
        console.log(`${message.author.username}: ${message.content}`)
    }
    
    if(message.channel.type === "dm") return;
    
    const prefix = guild_prefixes[message.guild.id] || global_prefix
    
    
    
    if(message.content.startsWith(global_prefix) && global_prefix !== prefix){
        message.channel.send(`The prefix for this server is: ${prefix}`).then(m => m.delete({ timeout: 5000 }));
    }
    
    try{
        let bot_id = "654736732985622541";
        if(!bot_id) return;
        if(message.mentions.users.first().id === bot_id){
            message.channel.send(`Prefix for this server is: ${prefix}`);
        }
    }catch(err){   
    }    

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    if(message.content.startsWith(prefix + "bal") || message.content.startsWith(prefix + "balance") || message.content.startsWith(prefix + "gamble") || message.content.startsWith(prefix + "pay") || message.content.startsWith(prefix + "daily") || message.content.startsWith(prefix + "report") || message.content.startsWith(prefix + "rob") || message.content.startsWith(prefix + "lyrics") || message.content.startsWith(prefix + "snake") || message.content.startsWith(prefix + "connect4") || message.content.startsWith(prefix + "hangman") || message.content.startsWith(prefix + "mute")){
        cmd = args.shift().toLowerCase();
    }
    let command;
    //let commandfile = Client.commands.get(cmd.slice(prefix.length));
    //if(commandfile){
        //commandfile.run(Client, message, args);
    //}else{
        //console.log(commandfile)
        
    //}

    if(Client.commands.has(cmd)) {
        command = Client.commands.get(cmd);
    } else if(Client.aliases.has(cmd)) {
        command = Client.commands.get(Client.aliases.get(cmd));
    }
    try {
        command.run(Client, message, args);
    } catch (e) {
        //return;
    }
    
    
    if(message.content.toLowerCase().startsWith(prefix + "prefix")){
        console.log("here")
        if(!message.member.permissions.has(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to use this command! Only an `ADMINISTRATOR` is able to use this command.");
        let guild_prefix = args[1]
        if(!guild_prefix) return message.channel.send("Please specify an arguement for the new server prefix.");
        if(guild_prefix.length >= 10) return message.channel.send("Your prefix must be less than 10 characters");
        
        await mongo().then(async mongoose => {
            try {
                const guildId = message.guild.id

                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    prefix: guild_prefix
                }, {
                    upsert: true
                })

                guild_prefixes[guildId] = guild_prefix

                message.reply(`:ok_hand: The prefix for this server is now: '${guild_prefix}'`);

            } finally{
                mongoose.connection.close()
            }
        })
    }
    
    
    
    if(message.content.toLowerCase().startsWith(prefix + "kick")) {
            if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("You do not have permission to run this command");
            if(!message.guild.me.permissions.has("KICK_MEMBERS")) return message.channel.send("I do not have permissions to kick users. Please enable the `KICK_MEMBERS` option on me.");

            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);

                if(member){
                    const { guild } = message

                    const { name } = guild
                    var reason = args.slice(2).join(" ");
                    if(!reason) return message.reply("Please give a reason to kick this user.");
                    try{
                        member.send(`You were kicked from the ${name} server! \n**Reason: ${reason}**`)
                    }catch(err){
                        console.log(err)
                    }
                    member.kick(`Kicked. Reason: ${reason}`).then(() =>{
                        message.reply(`Sucessfully kicked ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to kick this member');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            
    }


    if(message.content.toLowerCase().startsWith(prefix + "ban")) {
            if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("You do not have permission to run this command");
            if(!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send("I do not have permissions to ban users. Please enable the `BAN_MEMBERS` option on me.");

            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);

                if(member){
                    const { guild } = message

                    const { name } = guild
                    var reason = args.slice(2).join(" ");
                    if(!reason) return message.reply("Please give a reason to ban this user.");
                    try{
                        member.send(`You were banned from the ${name} server! \n**Reason: ${reason}**`)
                    }catch(err){
                        console.log(err)
                    }
                    member.ban({reason: `Banned. Reason: ${reason}`}).then(() =>{
                        message.reply(`Sucessfully banned ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to ban this member');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            
    }
    
   
    
    if(message.content.toLowerCase().startsWith(prefix + "warn")) {
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to run this command");
       
            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);
                if(member){
                    var reason = args.slice(2).join(" ");
                    if(!reason) return message.reply("Please give a reason to warn this user.");
                    member.send(`You were warned in **${message.guild.name}**. Reason: **${reason}** \nDo not let this happen again.`).then(() =>{
                        message.reply(`Sucessfully warned ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to give this member a warning');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            

    }
    
    if(message.content.toLowerCase().startsWith(prefix + "clear")){
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You don't have permission to use that command!")
        if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send("I do not have permissions to manage messages. Please enable the `MANAGE_MESSAGES` option on me.");

        let deleteAmt;

        if(isNaN(args[1]) || parseInt(args[1]) <= 0) { return message.reply("Please input a valid amount/integer!") }

        if(parseInt(args[1]) > 100){
           return message.reply("You can only delete a maximum of 100 messages at a time!")
        } else{
            deleteAmt = parseInt(args[1])
        }

        message.channel.bulkDelete(deleteAmt + 1, true)
        message.channel.send(`Successfully deleted **${deleteAmt}** messages!`)
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "fanny")) {
        if(message.guild.id !== "737268386861678675") return message.channel.send("This command is not available on this server!");
        if(!message.member.roles.cache.some(role => role.name === 'G R O M I T')) return message.channel.send("You do not have permission to run this command");
         
        
        const user = message.mentions.users.first();

        if(user){
            const member = message.guild.member(user);
            if(member){

                var date = new Date();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var dateNow = date.getDate();
                if(year < 1000){
                    year += 1900;
                }
                if(dateNow < 10){
                    dateNow = "0" + dateNow
                }
                if(month < 10){
                    month = "0" + month
                }

                let fannyschmuederRole = member.guild.roles.cache.find(b => b.name === "F A N N Y S C H M U E D E R");
                let cheeseRole = member.guild.roles.cache.find(c => c.name === "C H E E S E");
                let fannyLogChannel = Client.channels.cache.find(channel => channel.id === '737291958283665468');


                member.roles.add(fannyschmuederRole).then(() =>{
                    member.roles.remove(cheeseRole);
                    fannyLogChannel.send(`**FANNYSCHMUEDER ADDED** ${dateNow}/${month}/${year} - ${user.tag}`)
                    message.reply(`Sucessfully given Fannyschmueder to ${user.tag}`);
                }).catch(err =>{
                    message.reply('I was unable to fanny this user');
                    console.log(err);
                });
               
            }else{
                message.reply("That user is not in this server");
            }

            
        }else{
            message.reply("You need to specify a person");
        }
    }
    
    
    switch(args[0]){

        case "poll":
            if(!message.guild.me.permissions.has("EMBED_LINKS")  || !message.guild.me.permissions.has("ADD_REACTIONS")){
                message.channel.send("I do not have permissions to send embedded messages and/or add reactions to messages. Please enable the `EMBED_LINKS` and `ADD_REACTIONS` options on me.");
                break;
            }
            const pollEmbed = new MessageEmbed()
            .setColor("#d1900f")
            .setTitle("Democracy Voting Poll")
            .setDescription("Use `!poll (question)` to create a simple poll");

            if(!args[1]){
                message.channel.send(pollEmbed);
                break;
            }

            let msgArgs = args.slice(1).join(" ");
            pollEmbed.setDescription("📋 " + "**" + msgArgs + "**")
            pollEmbed.setFooter(`Poll created by ${message.author.tag}`)

            message.channel.send(pollEmbed).then(messageReaction => {
                messageReaction.react("👍");
                messageReaction.react("👎");
                message.delete({ timeout: 2000 }).catch(console.error)
            })

        break;
    }
    
    if (message.content.toLowerCase().startsWith(prefix + 'simprate')) {
        const simp = message.mentions.users.first() || message.author;
        if(simp){
            const member = message.guild.member(simp);

            if(member){
                const randomNum = Math.round(Math.random() * (100 - 0) + 0);
                message.channel.send(`${member.nickname || member.user.username} is ${randomNum}% simp`)
            }else{
                message.channel.send("That user is not in the server")
            }

        }else{
            const randomNum = Math.round(Math.random() * (100 - 0) + 0);
            message.channel.send(`${message.member.nickname || message.author.username} is ${randomNum}% simp`)
        }
    }

        

    switch (args[0]) {
        case 'play':
            if(!message.guild.me.permissions.has("CONNECT")  || !message.guild.me.permissions.has("SPEAK")){
                message.channel.send("I do not have permissions to connect to voice channels and/or add speak in voice channels. Please enable the `CONNECT` and `SPEAK` options on me.");
                break;
            }
    
            function play(connection, message){
                var server = servers[message.guild.id];
                if(server.queue[0] && connection.speaking.bitfield == 0){
                    server.dispatcher = connection.play(ytdl(server.queue[0], {filter: 'audioonly'}));
                    getInfo(server.queue[0]).then(info => {
                        message.channel.send(`:play_pause: Now Playing: **${info.items[0].title}**`)
                    }).catch(err =>{
                        message.channel.send(":play_pause: Next song has started playing")
                    });
                }
                
                function debounceEnd(){
                    debounce = true
                }
                    
                server.dispatcher.on("finish", function(){
                    if(debounce == true){
                        debounce = false
                        server.queue.shift();
                    
                        if(server.queue[0]){
                            console.log("Playing")
                            play(connection, message);
                        }else{
                            console.log("Goodbye")
                            connection.disconnect();
                        }

                        setTimeout(debounceEnd, 5000)

                    }
                    
                });
            }
            
            if(ytdl.validateURL(args[1]) == false){
                if(!message.member.voice.channel){
                    message.channel.send("You must be in a voice channel to play the bot!");
                    return;
                }
                let music = args.slice(1).join(" ");
                if(!music){
                    return message.channel.send("Please send a search query or link")
                }
                let results = await search(music, opts).catch(err => console.log(err));

                if(results) {
                    youtubeResults = results.results;
                    
                    let selected = youtubeResults[0];

                    if(!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }

                    var server = servers[message.guild.id];

                    getInfo(selected.link).then(info => {
                        message.channel.send(`**${info.items[0].title}** has been added to the queue!`)
                    }).catch(err =>{
                        message.channel.send("Song has been added to the queue")
                    });

                    server.queue.push(selected.link);
        
                    if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                        play(connection, message);
                    });
                }
            }else{
    
                if(!args[1]){
                    message.channel.send("you need to provide a link");
                    return;
                }
        
                if(!message.member.voice.channel){
                    message.channel.send("You must be in a voice channel to play the bot!");
                    return;
                }
        
                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                }
        
                var server = servers[message.guild.id];
        
                server.queue.push(args[1]);
                getInfo(args[1]).then(info => {
                    message.channel.send(`**${info.items[0].title}** has been added to the queue!`)
                }).catch(err =>{
                    message.channel.send("Song has been added to the queue")
                });
        
                if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                    play(connection, message);
                })
            }
        
            
    
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song...")
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.member.voice.channel){
                try{
                    for(var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i, 1);
                    }
                }
                catch(err){
                    return message.channel.send("There is no music playing!")
                }
                server.dispatcher.end();
                message.channel.send("Ending the queue, leaving the voice channel")
                console.log('stopped the queue')
            }

            if(message.member.voice.channel) message.member.voice.channel.leave();
            break;

             
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "urban")) {
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to send embedded links. Please enable the `EMBED_LINKS` option on me.");
        if(args <1 && !["random", "search"].includes(args[0])) return message.channel.send("The correct usage is `!urban search (query) | random option - !urban random`")
        let image2 = "https://retrorambling.files.wordpress.com/2013/12/312_johnny-cash.jpg"
        let search = args[1] ? urban(args.slice(1).join(" ")) : urban.random();
            try {
                search.first(res => {
                  if(!res) return message.channel.send(`No results found for this topic, sorry!`)
                  let { word, definition, example, thumbs_up, thumbs_down, permalink, author} = res

                      try {
                      let UrBanEmbed = new Discord.MessageEmbed()
                          .setColor("#00FFFF")
                          .setAuthor(`Urban Dictionary | ${word}`, image2)
                          .setThumbnail(image2)
                          .setDescription(stripIndents`**Definition:** ${definition || "No definition"}
                          \n**Example:** ${example || "No example"}
                          \n**Upvote:** ${thumbs_up || 0}
                          \n**Downvote:** ${thumbs_down || 0}
                          \n**Link:** [link to ${word}](${permalink || "https://www.urbandictionary.com/"})`)
                          .setFooter(`Written by ${author || "unknown"}`, message.guild.iconURL());



                          
                            message.channel.send(UrBanEmbed)



                        } catch(e) {
                            console.log(e)
                            return message.channel.send("That definition exceeds the character limit, sorry!")
                        }
                })
            } catch(e) {
                console.log(e)
                return message.channel.send("I'm broken, Try again!")
            }
    }
    
    const image = [
        {files: ["./photoshops/1.png/"]} ,
        {files: ["./photoshops/2.PNG/"]} ,
        {files: ["./photoshops/3.PNG/"]} ,
        {files: ["./photoshops/4.PNG/"]} ,
        {files: ["./photoshops/5.PNG/"]} ,
        {files: ["./photoshops/6.PNG/"]} ,
        {files: ["./photoshops/7.PNG/"]} ,
        {files: ["./photoshops/8.PNG/"]} ,
        {files: ["./photoshops/9.PNG/"]} ,
        {files: ["./photoshops/10.PNG/"]} ,
        {files: ["./photoshops/11.PNG/"]} ,
        {files: ["./photoshops/12.PNG/"]} ,
        {files: ["./photoshops/13.PNG/"]} ,
        {files: ["./photoshops/14.PNG/"]} ,
        {files: ["./photoshops/15.PNG/"]} ,
        {files: ["./photoshops/16.PNG/"]} ,
        {files: ["./photoshops/17.PNG/"]} ,
        {files: ["./photoshops/18.PNG/"]} ,
        {files: ["./photoshops/19.PNG/"]} ,
        {files: ["./photoshops/20.PNG/"]} ,
        {files: ["./photoshops/21.PNG/"]} ,
        {files: ["./photoshops/22.PNG/"]} ,
        {files: ["./photoshops/23.PNG/"]} ,
        {files: ["./photoshops/24.PNG/"]} ,
        {files: ["./photoshops/25.PNG/"]} ,
        {files: ["./photoshops/26.PNG/"]} ,
        {files: ["./photoshops/27.PNG/"]} ,
        {files: ["./photoshops/28.PNG/"]} ,
        {files: ["./photoshops/29.PNG/"]} ,
        {files: ["./photoshops/30.PNG/"]} ,
        {files: ["./photoshops/31.PNG/"]} ,
        {files: ["./photoshops/32.PNG/"]} ,
        {files: ["./photoshops/33.PNG/"]} ,
        {files: ["./photoshops/34.PNG/"]} ,
        {files: ["./photoshops/35.PNG/"]} ,
        {files: ["./photoshops/36.PNG/"]} ,
        {files: ["./photoshops/37.PNG/"]} ,
        {files: ["./photoshops/38.PNG/"]} ,
        {files: ["./photoshops/39.PNG/"]} ,
        {files: ["./photoshops/40.PNG/"]} ,
        {files: ["./photoshops/41.PNG/"]} ,
        {files: ["./photoshops/42.PNG/"]} ,
        {files: ["./photoshops/43.PNG/"]} ,
        {files: ["./photoshops/44.png/"]} ,
        {files: ["./photoshops/45.png/"]} ,
        {files: ["./photoshops/46.PNG/"]} ,
        {files: ["./photoshops/47.png/"]} ,
        {files: ["./photoshops/48.png/"]} ,
        {files: ["./photoshops/49.png/"]} ,
        {files: ["./photoshops/50.png/"]} ,
        {files: ["./photoshops/51.png/"]} ,
        {files: ["./photoshops/52.png/"]} ,
        {files: ["./photoshops/53.png/"]} ,
        {files: ["./photoshops/54.png/"]} ,
        {files: ["./photoshops/55.png/"]} ,
        {files: ["./photoshops/56.png/"]} ,
        {files: ["./photoshops/57.png/"]} ,
        {files: ["./photoshops/58.png/"]} ,
        {files: ["./photoshops/59.png/"]} ,
        {files: ["./photoshops/60.png/"]} ,
        {files: ["./photoshops/61.png/"]} ,
        {files: ["./photoshops/62.png/"]} ,
        {files: ["./photoshops/63.png/"]} ,
        {files: ["./photoshops/64.png/"]} ,
        {files: ["./photoshops/65.png/"]} ,
        {files: ["./photoshops/66.png/"]} ,
        {files: ["./photoshops/67.png/"]} ,
        {files: ["./photoshops/68.png/"]} ,
        {files: ["./photoshops/69.png/"]} ,
        {files: ["./photoshops/70.png/"]} ,
        {files: ["./photoshops/71.png/"]} ,
        {files: ["./photoshops/72.png/"]} ,
        {files: ["./photoshops/73.png/"]} ,
        {files: ["./photoshops/74.png/"]} ,
        {files: ["./photoshops/75.png/"]} ,
        {files: ["./photoshops/76.png/"]} ,
        {files: ["./photoshops/77.png/"]} ,
        {files: ["./photoshops/78.png/"]} ,
        {files: ["./photoshops/79.png/"]} ,
        {files: ["./photoshops/80.png/"]} ,
        {files: ["./photoshops/81.png/"]} ,
        {files: ["./photoshops/82.png/"]} ,
        {files: ["./photoshops/83.png/"]} ,
        {files: ["./photoshops/84.png/"]} ,
        {files: ["./photoshops/85.png/"]} ,
        {files: ["./photoshops/86.png/"]} ,
        {files: ["./photoshops/87.png/"]} ,
        {files: ["./photoshops/88.png/"]} ,
        {files: ["./photoshops/89.png/"]} ,
        {files: ["./photoshops/90.png/"]} ,
        {files: ["./photoshops/91.png/"]} ,
        {files: ["./photoshops/92.png/"]} ,
        {files: ["./photoshops/93.png/"]} ,
        {files: ["./photoshops/94.png/"]} ,
        {files: ["./photoshops/95.png/"]} ,
        {files: ["./photoshops/96.png/"]} ,
        {files: ["./photoshops/97.png/"]} ,
        {files: ["./photoshops/98.png/"]} ,
        {files: ["./photoshops/99.png/"]} ,
        {files: ["./photoshops/100.png/"]} ,
        {files: ["./photoshops/101.png/"]} ,
        {files: ["./photoshops/102.png/"]} ,
        {files: ["./photoshops/103.png/"]} ,
        {files: ["./photoshops/104.png/"]} ,
        {files: ["./photoshops/105.png/"]} ,
        {files: ["./photoshops/106.png/"]} ,
        {files: ["./photoshops/107.png/"]} ,
        {files: ["./photoshops/108.png/"]} ,
        {files: ["./photoshops/109.png/"]} ,
        {files: ["./photoshops/110.png/"]} ,
        {files: ["./photoshops/111.png/"]} ,
        {files: ["./photoshops/112.png/"]} ,
        {files: ["./photoshops/113.png/"]} ,
        {files: ["./photoshops/114.png/"]} ,
        {files: ["./photoshops/115.png/"]} ,
        {files: ["./photoshops/116.png/"]} ,
        {files: ["./photoshops/117.png/"]} ,
        {files: ["./photoshops/118.png/"]} ,
        {files: ["./photoshops/119.png/"]} ,
        {files: ["./photoshops/120.png/"]} ,
        {files: ["./photoshops/121.png/"]} ,
        {files: ["./photoshops/122.png/"]} ,
        {files: ["./photoshops/123.png/"]} ,
        {files: ["./photoshops/124.png/"]} ,
        {files: ["./photoshops/125.png/"]} ,
        {files: ["./photoshops/126.png/"]} ,
        {files: ["./photoshops/127.png/"]} ,
        {files: ["./photoshops/128.png/"]} ,
        {files: ["./photoshops/129.png/"]} ,
        {files: ["./photoshops/130.png/"]} ,
        {files: ["./photoshops/131.png/"]} ,
        {files: ["./photoshops/132.png/"]} ,
        {files: ["./photoshops/133.png/"]} ,
        {files: ["./photoshops/134.png/"]} ,
        {files: ["./photoshops/135.png/"]} ,
        {files: ["./photoshops/136.png/"]} ,
        {files: ["./photoshops/137.png/"]} ,
        {files: ["./photoshops/138.png/"]} ,
        {files: ["./photoshops/139.png/"]} ,
        {files: ["./photoshops/140.png/"]} ,
        {files: ["./photoshops/141.png/"]} ,
        {files: ["./photoshops/142.png/"]} ,
        {files: ["./photoshops/143.png/"]} ,
        {files: ["./photoshops/144.png/"]} ,
        {files: ["./photoshops/145.png/"]} ,
        {files: ["./photoshops/146.png/"]} ,
        {files: ["./photoshops/147.png/"]} ,
        {files: ["./photoshops/148.png/"]} ,
        {files: ["./photoshops/149.png/"]} ,
        {files: ["./photoshops/150.png/"]} ,
        {files: ["./photoshops/151.png/"]} ,
        {files: ["./photoshops/152.png/"]} ,
        {files: ["./photoshops/153.png/"]} ,
        {files: ["./photoshops/154.png/"]}
    ];





if(message.content.toLowerCase() === prefix + "photoshop"){
    if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to send images. Please enable the `ATTACH_FILES` option on me.");
        photonumber = 154;

        const randomPhoto = Math.floor(Math.random() * (photonumber - 1 + 1)) + 1;
    message.channel.send (image[randomPhoto]);
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "mrtubb")){
        if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to send images. Please enable the `ATTACH_FILES` option on me.");
        message.channel.send ({files: ["./mrtubb.jpg/"]});
    }

    const response  = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes - definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ];

    if(message.content.toLowerCase().startsWith(prefix + "8ball")){
        ballMessage = message.content.slice (7);
        responsenumber = 20;

        const randomIndex = Math.floor(Math.random() * (responsenumber - 1 + 1)) + 1;
    message.channel.send(response[randomIndex]);
        
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "wish")){
        wishChance = 2;
        
        const randomIndexWish = Math.floor(Math.random() * (wishChance - 1 + 1)) + 1;
        if(randomIndexWish == 1){
            message.channel.send("Your wish has been granted");
        }else if(randomIndexWish == 2){
            message.channel.send("Your wish has made me mad, thus you will not have your wish, and, you will receive much worse. Pain, misery, darkness for as long as i decide.");
        }

    
    }
    
    const cache = {}

    if(message.content.toLowerCase().startsWith(prefix + "set_im_joke")){
        if(!message.member.permissions.has('ADMINISTRATOR')){
            message.channel.send('You do not have permission to run this command.')
            return
        }
        let text = args[1]
        if(!text) return message.channel.send("Please specify a valid arguement, `true` or `false`.")
        if(text !== "true" && text !== "false") return message.channel.send("Please specify a valid arguement, `true` or `false`.")
        
        cache[message.guild.id] = [message.channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await imjokeSchema.findOneAndUpdate(
                {
                    _id: message.guild.id,
                }, 
                {
                    _id: message.guild.id,
                    channelId: message.channel.id,
                    text,
                }, 
                {
                    upsert: true
                }
            )
    
            } finally {
                mongoose.connection.close()
    
            }
        })
        message.channel.send(`:white_check_mark: Successfully set i'm joke messages to: ${text}`)

    }
    
    if(message.content.toLowerCase().startsWith("i'm") || message.content.toLowerCase().startsWith("im") || message.content.toLowerCase().startsWith("i’m")){
        let data = cache[message.guild.id]
        if(!data){
            console.log('FETCHING FROM THE DATABASE')
            await mongo().then(async mongoose =>{
                try {
                    const result = await imjokeSchema.findOne({_id: message.guild.id})

                    cache[message.guild.id] = data = [result.channelId, result.text]
                } catch(err) {
                    console.log("No such thing as data in this server")

                } finally {
                    mongoose.connection.close()
                }
            })
        }
        
        if(data){

            const _channelid = data[0]
            const text = data[1]

            const _channel = message.guild.channels.cache.get(_channelid)

            console.log(text)

            if(text == "false"){
                return
            }
            var exactIm = args[0]
            if(exactIm == "'m" || exactIm == "m" || exactIm == "’m"){
                var nameObject = args.slice(1).join(" ");
                if (nameObject){
                    let randomNum1 = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
                    if(randomNum1 == 5){
                        message.channel.send(`Hi, ${nameObject}! I'm Johnny Cash. \n\nIf you do not want these types of messages, type the following command: '!set_im_joke false'`)
                    }else{
                        message.channel.send(`Hi, ${nameObject}! I'm Johnny Cash.`);
                    }

                }
            }
        }
        
    }

    
    
    
    const CashFacts = [
        "I was much more than a songwriter, i was a writer in the broadest sense. As a child, i wrote poems, and continued to write stories as a teenager, honing my skills.",
        "I was a ordained minister. I was deeply religous. I was simultaneously a god-fearing Christian as well as a rebellious outlaw of sorts.",
        "I didn't actually write the famous song, Ring of Fire. The song was co-written by my to-be-wife, June Carter, as well as singer-songwriter Merle Kilgore. This version wasn't a hit to the billboards, but when i heard it, i knew there was something special about it. So i added a Mexican twist, and it became an immediate hit!",
        "Johnny Cash isn't my real name. Though “Cash” is indeed a great stage name, it’s also my real last name. “Johnny” was the made-up part. I grew up being J.R. Cash in Arkansas. It was only when I joined the Air Force in 1950 that I assigned myself a name, as the recruiter would not accept a candidate with initials for a name.",
        "I was no stranger to a jail cell. I was no stranger to the inside of a prison. In fact, I was arrested seven times for a variety of reasons, some from drug-related charges. Despite being arrested seven times, I only ever spent one night in jail. The arrests never held me back, and you could say it advanced my career in many ways. Two of my best-selling albums were recorded in prison: Johnny Cash at Folsom Prison in 1968 and Johnny Cash at San Quentin in 1969. I continued to visit prisons throughout my career to play for the prisoners. I, having been in jail, was sympathetic towards the plight of the imprisoned.",
        "My ‘desert island’ playlist would include Beethoven.",
        "I helped dig my brother’s grave. I experienced tragedy in my family at a fairly early age, when I was 12. I grew up admiring and loving my brother Jack, who was two years his senior. Jack was a mixture of protector and philosophical inspiration; despite his young years, he was deeply interested in the Bible and seemed to be on his way to becoming a preacher. Jack worked to help support the large Cash family, and while cutting wood one Saturday, he was accidentally pulled into a table saw. The saw mangled Jack’s midsection, and he exacerbated the problem by crawling across a dirty floor to reach help. Jack lingered for a week after the accident, but he stood no chance of surviving. His death had a profound impact on me, who until that time had been a gregarious boy, full of jokes. By all reports, I became more introspective afterwards and began to spend more time alone, writing stories and sketches. Jack’s deathbed words about seeing angels also affected him deeply on a spiritual level.",
        "I bought my first guitar in Germany. My oldest brother, Roy, was the first Cash to make a small splash in the music industry. Roy started a band called the Dixie Rhythm Ramblers, who for a time had a show on radio station KCLN and played all around Arkansas. Despite my obvious interest in music and talent for it, I wouldn’t get a guitar and start seriously writing songs until I joined the Air Force and was shipped away to Germany. My guitar, purchased in Öberammergau, cost about the same amount I'd won in that talent show years before. Soon, I was playing with a bunch of like-minded servicemen in a ragtag band branded the Landsberg Barbarians.",
        "I had a side career as a motion picture and TV star. In the late 50s, I moved out to California. A successful singer at this point, I had notions of following my friend Elvis Presley’s lead and making the move into motion pictures. This aspect of my career never took off in a big way, but throughout my life, I did appear in various movies and TV shows.",
        "I didn’t actually always wear black. Although I wrote a song called “Man in Black” that explained the philosophy behind why I always dressed in black (essentially, until people were treated fairly and injustices were addressed), I didn’t always perform wearing black clothes, and I didn’t always wear black in my day-to-day life.",
        "I windshield-wiped Faron Young's ashes. Befitting my status as one of the most prominent men in country music, I never failed to celebrate older musicians I admired, such as the Louvin Brothers or Ernest Tubb, or draw attention to younger musicians and songwriters such as Kris Kristofferson (whose “Sunday Mornin' Comin' Down” would become a big hit for me) or Rodney Crowell (who would eventually marry my daughter Roseanne).",
        "Big reputation. I had one of the more rough reputations in country music, to say the least. I was known to destroy my hotel rooms, have run-ins with the police and drive while under the influence of pills. One time, I broke my nose and lost some teeth after smashing my car into a utility pole.",
        "One of my greatest fears. Just because I had a rough-and-tumble image didn’t mean I was completely fearless. No, I was actually afraid of snakes and of flying.",
        "My first actual marriage. Carter wasn’t my first wife. I married Vivian Liberto in 1954, just a month after I was honorably discharged from military service. Our marriage wasn’t all that great, though we did have four daughters together. When Liberto filed for divorce in 1966, she cited my drug and alcohol use, long tour schedule, and affairs as the reasons. Even my closeness with Carter came into the picture during my divorce.",
        "I had some great friends. I never affiliated myself—at least publicly—with either political party in the US, but I did have great friendships with a few different presidents. It started with Richard Nixon and continued until Bill Clinton and George W. Bush. I also kept a healthy distrust of each of them, but my health also wasn’t that great during their presidencies. I was closest with Jimmy Carter, who also happened to be distantly related to my wife, June Carter.",
        "As a kid, I worked in the cotton fields. I used to eat cotton buds while out there, even though my mom warned me they would upset my stomach. Our family had 20 acres of land for the cotton farming, among other crops.",
        "Our family was not particularly well-off when I was a kid. My parents had seven children altogether and often struggled, especially during the Great Depression. At least twice, our family’s farm was flooded, which gave me the inspiration for my song “Five Feet High and Rising.” In fact, much of my very modest upbringing influenced my songwriting.",
        "Something else I learned in the Air Force, how to translate Russian Morse code.",
        "If you happened to live in Memphis in the mid-1950s, there’s a possibility that I sold you one of your appliances. Sales aren’t for everyone though, and I knew one thing for sure: it wasn’t for me. “I was the worst salesman in the world,” I once said.",
        "I was gifted with a species of tarantula named for me. The tarantula, who is all black and can be found in Folsom, CA, is aptly named **Aphonopelma johnnycashi.**",
        "In 1985, I teamed up with the likes of Kristofferson, Willie Nelson, and Waylon Jennings to form a country supergroup called The Highwaymen. We recorded three albums and performed periodically together throughout the latter half of the ‘80s and into the ‘90s.",
        "Highest of honours was awarded to me. There are only two people who have been inducted into to the Songwriter’s Hall of Fame, the Rock and Roll Hall of Fame and the Country Music Hall of Fame: Hank Williams and Johnny Cash.",
        "I had to have a cyst removed from my face while I was in the Air Force. The story goes that the doctor was drunk during the procedure and somehow messed up, leaving me with a permanent scar.",
        "I was only 12 years old when I started smoking. Although, if I had already gone through puberty at that point and had my trademark deep voice, it would be hard to tell that I was not yet a teen.",
        "Now this is what I call, a Ring of Fire. It took June a really long time before she agreed to marry me. I proposed to her 30 times before she finally gave in, and our marriage lasted from 1968 until her passing in 2003.",
        "Carter’s passing was sudden and it took its toll on me. She had gone in for heart surgery and died from complications relating to the surgery. One of my close friends, Kris Kristofferson, said that I struggled after she passed, and that “his daughter told me he cried every night.” Just four months later, I would also pass. I had been admitted to hospital not long before my death due to complications from diabetes.",
        "Maybe the reason it took Carter so long to say yes to me was because of another ardent musical suitor: Elvis Presley. I found love letters from Presley to Carter in the attic in the 1980s and promptly burned them.",
        "One of my biggest hits, “Ring of Fire,” wasn’t original to me. June Carter initially wrote the song as “(Love’s) Ring of Fire” for her sister, Anita. However, the song was actually written about me. Both me and Carter were married to other people at the time but the song was her way of expressing her feelings for me. Anita’s version didn’t catch, but when I heard it, he tweaked it to make it his own and it became an immediate hit—not just on country charts, but on pop charts as well."
    ];

    if(message.content.toLowerCase() === prefix + "fact"){
        cashnum = 28;

        const randomCash = Math.floor(Math.random() * (cashnum - 1 + 1)) + 1;
    message.channel.send(CashFacts[randomCash]);
    }
    
    if(message.content.startsWith('!search')) {
        message.channel.reply("This command no longer exists! Use the `!play` command as well as your search query: `!play (query)`")
    }
    
    if(bookwormAnswered == false && channelbookId == message.channel.id){
        console.log("PASSED")
        bookwormAnswer = message.content.toUpperCase()
        if(bookwormAnswer === "") return;
        if(message.author.bot) return;
        var bookwormCounter = 0;
        let chars = bookwormAnswer.split("")
        for(char in chars){
            if(chosenLetters.includes(chars[char])){
                console.log("Passed 2")
                console.log(bookwormCounter)
                bookwormCounter++;
                console.log(bookwormCounter)
                console.log(bookwormAnswer.length)
                if(bookwormCounter == bookwormAnswer.length){
                    if(words.includes(bookwormAnswer.toLowerCase())){
                        health -= (bookwormAnswer.length * 15)
                        console.log(health)
                        
                        if(health <= 0){
                            message.channel.send("You Win")
                  
                            return
                        }else{
                            var i;
                            for(i = 0; i < 16; i++){
                                const ranLetters = letters[Math.floor(Math.random() * letters.length)];
                                if(i == 4 || i == 8 || i == 12 || i == 16){
                                    chosenLetters.push("\n")
                                }
                                chosenLetters.push(ranLetters)
                            }
                            chosenLetters.splice(0, 19)
                            console.log("CHOSEN LETTERS: ")
                            console.log(chosenLetters)
                            healthBar = (`Enemy Health: ${health}`)
                            bookCashEmbed.fields = [];
                            bookCashEmbed.addField(chosenLetters.join('     '), healthBar)
                            message.channel.send(bookCashEmbed)

                            message.channel.awaitMessages(msg => {
                                if(message.author.bot) return;
                                console.log(msg)
                                bookwormCounter = 0;
                                let newChars = msg.content.split("")
                                for(newChar in newChars){
                                    if(chosenLetters.includes(newChars[newChar].toUpperCase())){
                                        bookwormCounter++;
                                        if(bookwormCounter == msg.content.length){
                                            if(words.includes(msg.content.toLowerCase())){
                                                console.log("WORDS IN")
                                                console.log(health)
                                                healthBar = (`Enemy Health: ${health}`)
                                                console.log(msg.content.length)
                                                health -= (msg.content.length * 20)
                                                console.log(health)
                                                if(health <= 0){
                                                    message.channel.send("You Win!")
                                                    
                                                    return
                                                }
                                                    
                                            }else{
                                             message.channel.send("You Lose! Not a valid word")
                                             
                                            }
                                        }
                                    }
                                }
                                
                            }, {max: 2})
                        }
                    }else{
                        message.channel.send("You Lose! Not a valid word")
                        
                    }
                
                }
            }else{
                message.channel.send("Use the letters provided")
                return
                
            }
        }
        bookwormCounter = 0; bookwormAnswer = ""; bookwormAnswered = true; channelbookId = ""
    }

    if(message.content.toLowerCase() === prefix + "bookcash"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        bookCashEmbed = new Discord.MessageEmbed();
        

        var Alexander = "https://vignette.wikia.nocookie.net/bookwormadventures/images/d/d9/Alexander.png/revision/latest/scale-to-width-down/180?cb=20100814135015";
        var Angry_Ewe = "https://vignette.wikia.nocookie.net/bookwormadventures/images/c/cc/AngryEwe.png/revision/latest/scale-to-width-down/180?cb=20100814151956";
        var Angry_mountain_goat = "https://vignette.wikia.nocookie.net/bookwormadventures/images/f/fc/AngryMountainGoat.png/revision/latest/scale-to-width-down/180?cb=20100814151511";
        var Angry_Ram = "https://vignette.wikia.nocookie.net/bookwormadventures/images/e/e9/AngryRam.png/revision/latest?cb=20100814152413";
        var Arnoldstein = "https://vignette.wikia.nocookie.net/bookwormadventures/images/b/b0/Arnoldstein.png/revision/latest/scale-to-width-down/300?cb=20170110091811";
        var Berzerkoid = "https://vignette.wikia.nocookie.net/bookwormadventures/images/c/cf/Bezerkoid.JPG/revision/latest/scale-to-width-down/250?cb=20120310003628";
        var Bigger_Brother = "https://vignette.wikia.nocookie.net/bookwormadventures/images/a/ab/Bigger_Borther_Enemy.jpg/revision/latest/scale-to-width-down/250?cb=20120528150021";
        var Bog_Serpent = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/89/Bog_Serpent.png/revision/latest/scale-to-width-down/300?cb=20170112093703";
        var Bull_Demon_King = "https://vignette.wikia.nocookie.net/bookwormadventures/images/7/78/Image.jpg/revision/latest/scale-to-width-down/250?cb=20150124041038";
        var Charybdis = "https://vignette.wikia.nocookie.net/bookwormadventures/images/c/ca/Charybdis.png/revision/latest/scale-to-width-down/180?cb=20100815233213";
        var Codex = "https://vignette.wikia.nocookie.net/bookwormadventures/images/0/0b/Codex.PNG/revision/latest/scale-to-width-down/250?cb=20120219005710";
        var Cyclops_Herder = "https://vignette.wikia.nocookie.net/bookwormadventures/images/2/2a/CyclopsHerder.png/revision/latest/scale-to-width-down/180?cb=20100814152201";
        var Cyclops_warrior = "https://vignette.wikia.nocookie.net/bookwormadventures/images/2/2a/CyclopsWarrior.png/revision/latest/scale-to-width-down/180?cb=20100814152712";
        var Dish_and_Spoon = "https://vignette.wikia.nocookie.net/bookwormadventures/images/b/b3/Dish_AND_Spoon.PNG/revision/latest/scale-to-width-down/250?cb=20110329080645";
        var Dracula = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/8f/Dracula.png/revision/latest/scale-to-width-down/250?cb=20120220085855";
        var Dread_Pirate_AlRobarts = "https://vignette.wikia.nocookie.net/bookwormadventures/images/a/a1/Untitled.png/revision/latest/scale-to-width-down/300?cb=20140315072828";
        var Elder_Tiger_Demon = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/12/Dead_Mstress_skeleton.png/revision/latest/scale-to-width-down/300?cb=20131227055651";
        var Enchanted_Eagle = "https://vignette.wikia.nocookie.net/bookwormadventures/images/6/6d/Enchanted_Eagle.png/revision/latest/scale-to-width-down/180?cb=20100816010043";
        var Enchanted_Hound = "https://vignette.wikia.nocookie.net/bookwormadventures/images/c/c7/Enchanted_Hound.png/revision/latest/scale-to-width-down/180?cb=20100816002340";
        var Enchanted_Lion = "https://vignette.wikia.nocookie.net/bookwormadventures/images/3/3e/Enchanted_Lion.png/revision/latest/scale-to-width-down/180?cb=20100816113550";
        var Enchanted_Ram = "https://vignette.wikia.nocookie.net/bookwormadventures/images/5/5a/Enchanted_Ram.png/revision/latest/scale-to-width-down/180?cb=20100816113616";
        var Eternal_Wanderer = "https://vignette.wikia.nocookie.net/bookwormadventures/images/9/9d/Eternal_Wanderer.png/revision/latest/scale-to-width-down/300?cb=20170112092023";
        var Fallen_Huntress_Hero = "https://vignette.wikia.nocookie.net/bookwormadventures/images/7/70/Fallen_Huntress_Hero.png/revision/latest/scale-to-width-down/300?cb=20170110091641";
        var Fallen_Wizard_Hero = "https://vignette.wikia.nocookie.net/bookwormadventures/images/f/f1/Fallen_Wizard_Hero.png/revision/latest/scale-to-width-down/313?cb=20170110084844";
        var Flying_Snake = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/82/Flying_Snake.png/revision/latest/scale-to-width-down/300?cb=20170112092707";
        var Gargoyle = "https://vignette.wikia.nocookie.net/bookwormadventures/images/6/6c/Castle_gargoyle.png/revision/latest/scale-to-width-down/400?cb=20131227163347";
        var Gold = "https://vignette.wikia.nocookie.net/bookwormadventures/images/5/50/Gold.jpg/revision/latest?cb=20180302114620";
        var Greater_Basilisk = "https://vignette.wikia.nocookie.net/bookwormadventures/images/b/b4/Greater_Basilisk.png/revision/latest/scale-to-width-down/300?cb=20170112091256";
        var Griffon = "https://vignette.wikia.nocookie.net/bookwormadventures/images/d/db/Griffon.jpg/revision/latest?cb=20150731001935";
        var Hydra = "https://vignette.wikia.nocookie.net/bookwormadventures/images/3/3b/Hydra_%28Head_6%29.png/revision/latest/scale-to-width-down/300?cb=20170110090748";
        var Kraken = "https://vignette.wikia.nocookie.net/bookwormadventures/images/d/d3/Kraken.png/revision/latest/scale-to-width-down/180?cb=20100815185453";
        var Lady_SummerSpeak = "https://vignette.wikia.nocookie.net/bookwormadventures/images/3/39/Lady_Smmr_Spk.PNG/revision/latest/scale-to-width-down/218?cb=20160923111202";
        var Lex = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/11/Lex_New_Avatar.jpg/revision/latest/scale-to-width-down/180?cb=20120528142123";
        var Medusa = "https://vignette.wikia.nocookie.net/bookwormadventures/images/c/c3/Medusa.png/revision/latest?cb=20150219014259";
        var Minotaur = "https://vignette.wikia.nocookie.net/bookwormadventures/images/e/ef/Minotaur.PNG/revision/latest/scale-to-width-down/250?cb=20120219103355";
        var Mirage_Xel = "https://vignette.wikia.nocookie.net/bookwormadventures/images/d/d2/Mirage_Xel.png/revision/latest/scale-to-width-down/250?cb=20120220091527";
        var Monolithic_Obelisk = "https://vignette.wikia.nocookie.net/bookwormadventures/images/9/91/Monolisk.JPG/revision/latest?cb=20120311032549";
        var Mysterious_Assassin = "https://vignette.wikia.nocookie.net/bookwormadventures/images/5/55/Mysterious_Assassin.png/revision/latest/scale-to-width-down/300?cb=20170112092300";
        var Nemean_Lion = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/4d/Nemean_Lion.png/revision/latest/scale-to-width-down/250?cb=20120220093707";
        var Polydamas = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/1d/Polydamas.png/revision/latest/scale-to-width-down/250?cb=20100814135354";
        var Polyphemus = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/47/Polyphemus.png/revision/latest/scale-to-width-down/180?cb=20100814153023";
        var Roc_Hatchling = "https://vignette.wikia.nocookie.net/bookwormadventures/images/5/57/Roc_Hatchling.png/revision/latest/scale-to-width-down/300?cb=20170110090505";
        var Scylla = "https://vignette.wikia.nocookie.net/bookwormadventures/images/6/60/Scylla.png/revision/latest/scale-to-width-down/180?cb=20100815185905";
        var Sea_Elemental = "https://vignette.wikia.nocookie.net/bookwormadventures/images/9/92/Sea_Elemental.png/revision/latest/scale-to-width-down/180?cb=20100815185433";
        var Sea_Serpent = "https://vignette.wikia.nocookie.net/bookwormadventures/images/6/6c/SeaSerpent.png/revision/latest/scale-to-width-down/180?cb=20100815043500";
        var Sea_Witch = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/89/SeaWitch.png/revision/latest/scale-to-width-down/180?cb=20100815051825";
        var Siren = "https://vignette.wikia.nocookie.net/bookwormadventures/images/0/0a/Siren.png/revision/latest/scale-to-width-down/180?cb=20100815045723";
        var Skeletrox = "https://vignette.wikia.nocookie.net/bookwormadventures/images/f/ff/Skeletrox_Bad.jpg/revision/latest/scale-to-width-down/250?cb=20120318000319";
        var Snake_Charmer = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/13/Snake_Charmer.png/revision/latest/scale-to-width-down/300?cb=20170112093355";
        var Strangling_Ghost = "https://vignette.wikia.nocookie.net/bookwormadventures/images/a/af/SmashedTiles1.png/revision/latest/scale-to-width-down/200?cb=20100820175631";
        var Summoned_WolfMan = "https://vignette.wikia.nocookie.net/bookwormadventures/images/d/de/Summoned_Wolf-Man.png/revision/latest/scale-to-width-down/300?cb=20170110091103";
        var Swashbuckler = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/88/Swashbuckler.png/revision/latest/scale-to-width-down/300?cb=20170112093208";
        var Sword_Swallower = "https://vignette.wikia.nocookie.net/bookwormadventures/images/9/9f/Sword_Swallower.png/revision/latest/scale-to-width-down/300?cb=20170112092518";
        var The_Beatbots = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/46/Beatbots.jpg/revision/latest/scale-to-width-down/250?cb=20120528123417";
        var The_Butterfly = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/42/321.PNG/revision/latest?cb=20140906051051";
        var The_Machine = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/44/The_Machine.PNG/revision/latest/scale-to-width-down/250?cb=20120219005825";
        var The_Monkey_King = "https://vignette.wikia.nocookie.net/bookwormadventures/images/5/57/Wikia.png/revision/latest?cb=20141010115744";
        var The_Queen_of_Hearts = "https://vignette.wikia.nocookie.net/bookwormadventures/images/2/25/Queen_of_Hearts.jpg/revision/latest?cb=20120602081855";
        var The_WolfMan = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/16/The_Wolf_Man.png/revision/latest/scale-to-width-down/300?cb=20170110084949";
        var Thieves4 = "https://vignette.wikia.nocookie.net/bookwormadventures/images/4/4a/Thieves_4_%26_5.png/revision/latest/scale-to-width-down/300?cb=20170110085906";
        var Thieves9 = "https://vignette.wikia.nocookie.net/bookwormadventures/images/0/06/Thieves_9%2C_10_%26_11.png/revision/latest/scale-to-width-down/300?cb=20170110085508";
        var Toxophilite = "https://vignette.wikia.nocookie.net/bookwormadventures/images/3/3e/Toxophlite.png/revision/latest?cb=20130520170517";
        var Trojan_Captain = "https://vignette.wikia.nocookie.net/bookwormadventures/images/7/76/TrojanCaptain.png/revision/latest/scale-to-width-down/180?cb=20100814134614";
        var Trojan_Spearman = "https://vignette.wikia.nocookie.net/bookwormadventures/images/7/73/TrojanSpearman.png/revision/latest/scale-to-width-down/180?cb=20100814114136";
        var Unliving_Pyromancer = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/8b/Unliving_Pyromancer.png/revision/latest/scale-to-width-down/300?cb=20170110085655";
        var Vampire_Cultist = "https://vignette.wikia.nocookie.net/bookwormadventures/images/f/f9/Da_vampire_Cultist.png/revision/latest/scale-to-width-down/400?cb=20131227025124";
        var Vampire_Mistress = "https://vignette.wikia.nocookie.net/bookwormadventures/images/3/3f/Vampire_Mistress.png/revision/latest/scale-to-width-down/400?cb=20131227052733";
        var War_Hound = "https://vignette.wikia.nocookie.net/bookwormadventures/images/f/f0/WarHound.png/revision/latest/scale-to-width-down/180?cb=20100814115350";
        var WereHawk = "https://vignette.wikia.nocookie.net/bookwormadventures/images/8/83/Were-Hawk.png/revision/latest/scale-to-width-down/300?cb=20170110090144";
        var White_Bone_Spirit = "https://vignette.wikia.nocookie.net/bookwormadventures/images/0/0a/White_Bone_Spirit.jpg/revision/latest/scale-to-width-down/250?cb=20150124041101";
        var Year_of_the_Horse = "https://vignette.wikia.nocookie.net/bookwormadventures/images/a/ab/LockedTiles.png/revision/latest/scale-to-width-down/200?cb=20100814162103";
        var Year_of_the_Rooster = "https://vignette.wikia.nocookie.net/bookwormadventures/images/1/19/RainbowTile.png/revision/latest/scale-to-width-down/180?cb=20100820173155";


        var enemies = [Alexander, Angry_Ewe, Angry_mountain_goat, Angry_Ram, Arnoldstein, Berzerkoid, Bigger_Brother, Bog_Serpent, Bull_Demon_King, Charybdis, Codex, Cyclops_Herder, Cyclops_warrior, Dish_and_Spoon, Dracula, Dread_Pirate_AlRobarts, Elder_Tiger_Demon, Enchanted_Eagle, Enchanted_Hound, Enchanted_Lion, Enchanted_Ram, Eternal_Wanderer, Fallen_Huntress_Hero, Fallen_Wizard_Hero, Flying_Snake, Gargoyle, Gold, Greater_Basilisk, Griffon, Hydra, Kraken, Lady_SummerSpeak, Lex, Medusa, Minotaur, Mirage_Xel, Monolithic_Obelisk, Mysterious_Assassin, Nemean_Lion, Polydamas, Polyphemus, Roc_Hatchling, Scylla, Sea_Elemental, Sea_Serpent, Sea_Witch, Siren, Skeletrox, Snake_Charmer, Strangling_Ghost, Summoned_WolfMan, Swashbuckler, Sword_Swallower, The_Beatbots, The_Butterfly, The_Machine, The_Monkey_King, The_Queen_of_Hearts, The_WolfMan, Thieves4, Thieves9, Toxophilite, Trojan_Captain, Trojan_Spearman, Unliving_Pyromancer, Vampire_Cultist, Vampire_Mistress, War_Hound, WereHawk, White_Bone_Spirit, Year_of_the_Horse, Year_of_the_Rooster]

        letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        chosenLetters = [];

        bookCashEmbed.setTitle("BookCash Adventures Deluxe");
        bookCashEmbed.setColor("#92a5e0")

        bookCashEmbed.setImage(enemies[Math.floor(Math.random() * enemies.length)])

        

        var i;
        for(i = 0; i < 16; i++){
            const ranLetters = letters[Math.floor(Math.random() * letters.length)];
            if(i == 4 || i == 8 || i == 12 || i == 16){
                chosenLetters.push("\n")
            }
            chosenLetters.push(ranLetters)
        
            

        }
        console.log(chosenLetters)

        health = 100

        healthBar = (`Enemy Health: ${health}`)



        bookCashEmbed.setDescription("Letters Available:")
        bookCashEmbed.addField(chosenLetters.join('     '), healthBar)
        bookwormAnswered = false
        
        message.channel.send(bookCashEmbed)
        bookwormer = message.author
        channelbookId = message.channel.id
        
    }
    
    
    if (answered == false && message.author == quizUser && !message.author.bot && message.channel.id == channelId){
        //userAnswerMan = message.guild
        //userAnswerMan = message.guild
        userAnswer = message.content.toUpperCase()
        if(message.author.bot) return;
        if(userAnswer == cAnswer){
            message.reply("Got it RIGHT! :+1: ")
            
        } else {
            message.reply("Got it WRONG! :-1: ")
            
        }
        answered = true; cAnswer = ""; userAnswer = ""; channelId = "";

    }

    if (message.content.toLowerCase() === prefix + "quiz"){
        quizes = 72;
        var randomQuiz = Math.floor(Math.random() * (quizes - 1 + 1)) + 1;
        switch(randomQuiz) {
            case 1: message.channel.send("What is Johnny Cash's REAL name? \n A. Johnny Cash \n B. John R. Cash \n C. Johhny Vegas \n D. Salisbury"); cAnswer = "B"; break;
            case 2: message.channel.send("What is the best video? \n A. Quaternion Explained \n B. Bricks \n C. In the Hall of the Mountain Cone \n D. How to press every button on a keyboard."); cAnswer = "A"; break;
            case 3: message.channel.send("What is the 69th most populated city? \n A. Shanghai - China \n B. Berlin - Germany \n C. Alexandria - Egypt \n D. Amman - Jordan"); cAnswer = "C"; break;
            case 4: message.channel.send("What is the meaning of life? \n A. Nothing \n B. Answer A \n C. Being alive \n D. All of the above"); cAnswer = "C"; break;
            case 5: message.channel.send("Why was my name originally. 'Ring Of Fire'? \n A. Because the creator was lazy \n B. The bot was originally meant for playing Ring Of Fire \n C. It was cool \n D. Because it was 2019"); cAnswer = "B"; break;
            case 6: message.channel.send("Exactly how many chins does David Tubb have? \n A. 42 \n B. 0 \n C. 14,073 \n D. 53.242"); cAnswer = "D"; break;
            case 7: message.channel.send("Who is the best discord Bot? \n A. MEE6 \n B. Johnny Cash \n C. Meme Bots \n D. Gromit"); cAnswer = "B"; break;
            case 8: message.channel.send("Why was Sir Thomas Salisbury executed in 1586? \n A. Robbery \n B. Eating \n C. Being poor \n D. His involvement in the Babington Plot to murder Queen Elizabeth I"); cAnswer = "D"; break;
            case 9: message.channel.send("Who murdered Urien of Rheged? \n A. Phil Swift \n B. Llofan Llaf Difo \n C. David Bowie \n D. Micheal Hark"); cAnswer = "B"; break;
            case 10: message.channel.send("Of what lineage is Rhydderch Hael a part of, according to the Harleian Geneaologies? \n A. Macsen Wledig lineage \n B. Arsen Wolk lineage \n C. Bhutan of Peoples \n D. DeK CeK lineage"); cAnswer = "A"; break;
            case 11: message.channel.send("What recent discovery in Scotland is believed to be a forgotten stronghold of Rheged? \n A. A book \n B. A bone \n C. A fossil \n D. A heart"); cAnswer = "D"; break;
            case 12: message.channel.send("Who wrote, 'I Walked the Line'? \n A. Johnny Cash \n B. Johnny Cash \n C. Johnny Cash \n D. Johnny Cash"); cAnswer = "C"; break;
            case 13: message.channel.send("In what year did The Battle of Culloden take place? \n A. 1746 \n B. 1755 \n C. 1801 \n D. 1794"); cAnswer = "A"; break;
            case 14: message.channel.send("What caused the French Revolution to commence? \n A. Rise in economy \n B. Crash in economy \n C. Constant flow in economy \n D. Temporary decline in economy"); cAnswer = "B"; break;
            case 15: message.channel.send("Why did the Romans leave Britain in AD410? \n A. They lost in numerous amounts of wars \n B. The environment wasn't suitable for them \n C. The Roman Emperor Honorius said so \n D. Many tragic deaths occurred"); cAnswer = "C"; break;
            case 16: message.channel.send("Which of these were NOT a real Doctor? \n A. Dr Frenk Austin \n B. Dr John Dee \n C. Dr James Grime \n D. Dr Phil"); cAnswer = "A"; break;
            case 17: message.channel.send("How many countries are there in the world? \n A. 194 \n B. 197 \n C. 196 \n D. 195"); cAnswer = "B"; break;
            case 18: message.channel.send("How many republics were in Yugoslavia? \n A. 12 \n B. 6 \n C. 11 \n D. 8"); cAnswer = "B"; break;
            case 19: message.channel.send("What is the most hated fruit of all time? \n A. Apple \n B. Tomato \n C. Grape \n D. Banana"); cAnswer = "B"; break;
            case 20: message.channel.send("How many federational governments did the UK have in total? \n A. 44 \n B. 32 \n C. 0 \n D. 1"); cAnswer = "C"; break;
            case 21: message.channel.send("What is the translation for: 01110011 01110000 01100001 01100111 01101000 01100101 01110100 01110100 01101001 00001010? \n A. spaghetti \n B. carrot \n C. keyboard \n D. potato"); cAnswer = "A"; break;
            case 22: message.channel.send("If y=x, then x= ? \n A. -x \n B. -y \n C. y \n D. x"); cAnswer = "D"; break;
            case 23: message.channel.send("How many digits does an irrational number have? \n A. 4144714291924719 \n B. 3 \n C. 35 \n D. infinity"); cAnswer = "D"; break;
            case 24: message.channel.send("What caused the fire that caused terror to Gorb Grenclunklein July 2020? \n A. Tom \n B. The Sims \n C. Gorb \n D. Global Warming"); cAnswer = "B"; break;
            case 25: message.channel.send("How many bananas is a fatal dose? \n A. 200 \n B. 300 \n C. 400 \n D. 500"); cAnswer = "C"; break;
            case 26: message.channel.send("What is the 7th letter in the Greek alphabet? \n A. Zeta \n B. Epsilon \n C. Eta \n D. Theta"); cAnswer = "C"; break;
            case 27: message.channel.send("Should Johnny Cash Bot take over all of Discord? \n A. Yes \n B. No \n C. Maybe \n D. Don't know"); cAnswer = "A"; break;
            case 28: message.channel.send("How do birds fly? \n A. With their wings \n B. They jump \n C. AAaaaaaa \n D. They kill themselves"); cAnswer = "A"; break;
            case 29: message.channel.send("Who was Geoffrey of Monmouth? \n A. A Historian \n B. A pseudo-historical writer who fucked up the course of history for centuries to come \n C. A History teacher \n D. A normal person"); cAnswer = "B"; break;
            case 30: message.channel.send("YOU HAVE ENCOUNTERED THE £1,000,000 QUESTION: Solve for x, √−1x - iy * eπx^2 / dy/dx = 0 \n \n A. 31.4 \n \n B. sin(31) \n \n C. tanh(eπ) \n \n D. eπ^eπ"); cAnswer = "D"; break;
            case 31: message.channel.send("How many months have 28 days? \n A. 1 \n B. 5 \n C. 12 \n D. 0"); cAnswer = "C"; break;
            case 32: message.channel.send("Are you stupid? \n A. Yes \n B. No \n C. Yes \n D. Yes"); cAnswer = "A"; break;
            case 33: message.channel.send("When was the last time England had a civil war? \n A. 57 years \n B. 300 years \n C. 532 years \n D. 369 years"); cAnswer = "D"; break;
            case 34: message.channel.send("Which of these created the moon? \n A. Gravity \n B. Earth \n C. Supernova \n D. Dark Matter"); cAnswer = "B"; break;
            case 35: message.channel.send("How many minutes in a year? \n A. 525600 \n B. 8760 \n C. 3.154e+7 \n D. 600000"); cAnswer = "A"; break;
            case 36: message.channel.send("How would it be possible to press all keys on a keyboard? \n A. Buy a computer \n B. Watch Toby's video \n C. Smash it with another keyboard \n D. Divide by zero"); cAnswer = "B"; break;
            case 37: message.channel.send("Pssst, the answer is 'E', trust me ;) \n A. Im picking 'A' instead \n B. No \n C. Why \n D. Screw you"); cAnswer = "E"; break;
            case 38: message.channel.send("Am i a good looking man? \n A. Yes \n B. No \n C. Maybe \n D. I like myself more"); cAnswer = "A"; break;
            case 39: message.channel.send("How old would I be if i were still alive? \n A. 57 \n B. 71 \n C. 88 \n D. 89"); cAnswer = "C"; break;
            case 40: message.channel.send("Who is the best guitarist of all time? \n A. Brian May \n B. David Gilmour \n C. Jimmy Page \n D. Johnny Cash"); cAnswer = "D"; break;
            case 41: message.channel.send("Which of these is NOT a square number? \n A. 64 \n B. 49 \n C. 72 \n D. 81"); cAnswer = "C"; break;
            case 42: message.channel.send("In a normal game of chess, how many pawns do each person get? \n A. 5 \n B. 8 \n c. 6 \n D. 10"); cAnswer = "B"; break;
            case 43: message.channel.send("In a normal game of darts, what is the highest score you can achieve? \n A. 180 \n B. 360 \n C. 100 \n D. 150"); cAnswer = "A"; break;
            case 44: message.channel.send("How many planets are there in the solar system? \n A. 7 \n B. 9 \n C. 10 \n D. 8"); cAnswer = "D"; break;
            case 45: message.channel.send("Which sport commonly uses the term 'Hole in One'? \n A. Basketball \n B. Golf \n C. Bowling \n D. Badminton"); cAnswer = "B"; break;
            case 46: message.channel.send("What is the sum of a triangle's interior angles in degrees? \n A. 180° \n B. 360° \n C. 60° \n D. 150°"); cAnswer = "A"; break;
            case 47: message.channel.send("How many months are there in 3 years? \n A. 39 \n B. 21 \n C. 36 \n D. 40"); cAnswer = "C"; break;
            case 48: message.channel.send("How many metres in a kilometer? \n A. 1600 \n B. 1000 \n C. 10 \n D. 100"); cAnswer = "B"; break;
            case 49: message.channel.send("What is the Roman Numeral for the number 3291? \n A. MMMCCXCI \n B. MMCCXII \n C. MMMCXXI \n D. MMMCCCXI"); cAnswer = "A"; break;
            case 50: message.channel.send("Argentina is a part of which continent? \n A. South America \n B. Asia \n C. North America \n D. Europe"); cAnswer = "A"; break;
            case 51: message.channel.send("Which Youtuber faced controversy after uploading a video containing a dead man, who had comitted suicide, on the 31st of December 2017? \n A. DanTDM \n B. Deji \n C. stampylonghead \n D. Logan Paul"); cAnswer = "D"; break;
            case 52: message.channel.send("What is the capital of the USA? \n A. Miami \n B. Washington D.C. \n C. Los Angeles \n D. New York City"); cAnswer = "B"; break;
            case 53: message.channel.send("What is the term given to the longest and shortest days of the year? \n A. Eclipse \n B. Equinox \n C. Solstice \n D. Occulation"); cAnswer = "C"; break;
            case 54: message.channel.send("How many strings are there on a standard Bass guitar? \n A. 6 \n B. 7 \n C. 5 \n D. 4"); cAnswer = "D"; break;
            case 55: message.channel.send("In which year was the Irish Free State established? \n A. 1916 \n B. 1924 \n C. 1922 \n D. 1918"); cAnswer = "C"; break;
            case 56: message.channel.send("When is Halley's Comet next projected to travel past Earth? \n A. 2061 \n B. 2071 \n C. 2076 \n D. 2066"); cAnswer = "A"; break;
            case 57: message.channel.send("Which sport did Fanny Chmelar play for Germany? \n A. Swimming \n B. Skiing \n C. Sprinting \n D. Sailing"); cAnswer = "B"; break;
            case 58: message.channel.send("What is the name of the 1983 arcade game featuring a police mouse as the main character? \n A. Dig Dug \n B. Tapper \n C. Mappy \n D. Food Fight"); cAnswer = "C"; break;
            case 59: message.channel.send("How many colours are there on the standard LGBT pride flag? \n A. 8 \n B. 6 \n C. 7 \n D. 9"); cAnswer = "B"; break;
            case 60: message.channel.send("How many lines of symmetry does an Equilateral triangle? \n A. 1 \n B. 0 \n C. 2 \n D. 3"); cAnswer = "D"; break;
            case 61: message.channel.send("In which sport is a shuttlecock used? \n A. Tennis \n B. Table Tennis \n C. Squash \n D. Badminton"); cAnswer = "D"; break;
            case 62: message.channel.send("How many inches are in 2 feet? \n A. 24 \n B. 20 \n C. 12 \n D. 50"); cAnswer = "A"; break;
            case 63: message.channel.send("Which country hosted the 2016 Olympic games? \n A. Brazil \n B. Greece \n C. China \n D. United Kingdom"); cAnswer = "A"; break;
            case 64: message.channel.send("What name was given to the Jewish god? \n A. Allah \n B. Adam \n C. Jehovah \n D. Jesus"); cAnswer = "C"; break;
            case 65: message.channel.send("What is the standard unit of power? \n A. Tesla \n B. Watt \n C. Joule \n D. Ohm"); cAnswer = "B"; break;
            case 66: message.channel.send("What is the standard unit of resistance? \n A. Ohm \n B. Joule \n C. Volt \n D. Amp"); cAnswer = "A"; break;
            case 67: message.channel.send("How many sides does a quadrilateral shape have? \n A. 4 \n B. 3 \n C. 6 \n D. 5"); cAnswer = "A"; break;
            case 68: message.channel.send("Which religion has a crescent moon and star as it's symbol? \n A. Judaism \n B. Islam \n C. Sikhism \n D. Christianity"); cAnswer = "B"; break;
            case 69: message.channel.send("How many stars are present on the flag of the United States of America? \n A. 30 \n B. 40 \n C. 60 \n D. 50"); cAnswer = "D"; break;
            case 70: message.channel.send("How many edges does a cube have? \n A. 12 \n B. 14 \n C. 6 \n D. 10"); cAnswer = "A"; break;
            case 71: message.channel.send("What is the capital city of France? \n A. Lyon \n B. Marseille \n C. Paris \n D. Bordeaux"); cAnswer = "C"; break;
            case 72: message.channel.send("Which of these is NOT a current member of the European Union? \n A. Germany \n B. France \n C. Spain \n D. Switzerland"); cAnswer = "D"; break;
            


            
        }
        answered = false
        quizUser = message.author
        channelId = message.channel.id
    
        
    }
    
    if(message.content.startsWith(prefix + "rps" + " ")){
        rpsOptions = 3;
        var randomChoose = Math.floor(Math.random() * (rpsOptions - 1 + 1)) + 1;
        rpsUserAnswer = message.content.charAt(5).toUpperCase() + message.content.slice([6])
        switch(randomChoose){
            case 1: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Rock**`); rpsAnswer = "Rock"; break;
            case 2: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Paper**`); rpsAnswer = "Paper"; break;
            case 3: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Scissors**`); rpsAnswer = "Scissors"; break;
        }
        rpsAnswered = false

    } else if(message.content.startsWith(prefix + "rps")){
        message.reply("Please reply with what you want to use!")
    }

    if (rpsAnswered == false){
        if(message.author.bot) return;
        if(rpsUserAnswer == rpsAnswer){
            message.reply("We tied, that ain't fun, so let's play again.");
        } else if(rpsUserAnswer == "Rock" && rpsAnswer == "Paper"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Rock" && rpsAnswer == "Scissors"){
            message.reply("YOU WIN!");
            
        } else if(rpsUserAnswer == "Paper" && rpsAnswer == "Rock"){
            message.reply("YOU WIN!");
            
        } else if(rpsUserAnswer == "Paper" && rpsAnswer == "Scissors"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Scissors" && rpsAnswer == "Rock"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Scissors" && rpsAnswer == "Paper"){
            message.reply("YOU WIN!");
            
        }
        else{
            message.reply("That was not an option, so I still win! HAH, RING OF FIRE!!!!!!")
        }
        
            
            
        
        rpsAnswered = true; rpsAnswer = ""; rpsUserAnswer = "";

    }
    
    if (message.content.toLowerCase() === prefix + "hdtubb"){
        if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to send images. Please enable the `ATTACH_FILES` option on me.");
        message.channel.send ({files: ["./hdtubb.jpg/"]});
    }
    
    if (message.content.toLowerCase() === prefix + "tubb2"){
        if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to send images. Please enable the `ATTACH_FILES` option on me.");
        message.channel.send ({files: ["./tubb2.jpg/"]});
    }
    
    let image2 = "https://retrorambling.files.wordpress.com/2013/12/312_johnny-cash.jpg"

    if(message.content.toLowerCase() === prefix + "help"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const commandsEmbed = new Discord.MessageEmbed()
        .setTitle('Help Commands')
        .addField("`" + prefix + 'basichelp`', "A list of basic commands", true)
        .addField("`" + prefix + 'musichelp`', "A list of music commands", true)
        .addField("`" + prefix + 'imagehelp`', "A list of image commands", true)
        .addField("`" + prefix + 'funhelp`', "A list of fun and games commands", true)
        .addField("`" + prefix + 'adminhelp`', "A list of administration commands. Some of which can be used by everyone", true)
        .addField("`" + prefix + 'currencyhelp`', "A list of currency commands",true)
        .addField("`" + prefix + 'educationhelp`', "A list of educational and learning commands",true)
        .addField("`" + prefix + 'confighelp`', "A list of configuration commands that only the Administrator can toggle.",true)
        .addField('**Want me on your server?**', '[Click here](https://discord.com/api/oauth2/authorize?client_id=654736732985622541&permissions=821165686&scope=bot) to invite me to your server', true)
        .addField('**Join the CHEESE server**', '[Click here](https://discord.gg/Esuapxj) to join the CHEESE server today!', true)
        .setFooter('Bot Made By: Quaternion#9999')
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(commandsEmbed)

        
    }

    if(message.content.toLowerCase() === prefix + "basichelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const basicEmbed = new Discord.MessageEmbed()
        .setTitle('Basic Commands')
        .addField("`" + prefix + 'hello`', "Johnny Cash will say hello to you.")
        .addField("`" + prefix + 'help`', "The reason you came here.")
        .addField("`" + prefix + 'ping`', "Shows how fast i respond back.")
        .addField("`" + prefix + 'serverinfo`', "Shows some information about the server")
        .addField("`" + prefix + 'userinfo (user)`', "Shows some information about the certain user")
        .addField("`" + prefix + 'ARGH`', "AAAARRRRGGGHHH!!!")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(basicEmbed)
    }

    if(message.content.toLowerCase() === prefix + "musichelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const musicEmbed = new Discord.MessageEmbed()
        .setTitle('Music Commands')
        .addField("`" + prefix + 'play (link or search query)`', "Make sure you are in Voice Channel, and insert YouTube link, or search query, and let Johnny Cash do the rest!")
        .addField("`" + prefix + 'skip`', "Skip the playing song.")
        .addField("`" + prefix + 'stop`', "Music will stop playing.")
        .addField("`" + prefix + 'lyrics (search)`', "Get the lyrics for a song.")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(musicEmbed)
    }

    if(message.content.toLowerCase() === prefix + "imagehelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const imageEmbed = new Discord.MessageEmbed()
        .setTitle('Image Commands')
        .addField("`" + prefix + 'photoshop`', "Johnny Cash will send you one of the many made cursed photoshops made by the Wallaces.")
        .addField("`" + prefix + 'mrtubb`', "Get an image of the man himself.")
        .addField("`" + prefix + 'hdtubb`', "Get a HD image of Mr Tubb!")
        .addField("`" + prefix + 'tubb2`', "Get an image of a new Mr Tubb photo!")
        .addField("`" + prefix + 'meme`', "Get a random meme!")
        .addField("`" + prefix + 'cursed`', "Get a random cursed image!")
        .addField("`" + prefix + 'image (search query)`', "Get an image of your search query!")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(imageEmbed)

    }

    if(message.content.toLowerCase() === prefix + "funhelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const funEmbed = new Discord.MessageEmbed()
        .setTitle('Fun and Games Commands')
        .addField("`" + prefix + '8ball (question)`', "Ask a yes or no question, and let your fate decide...")
        .addField("`" + prefix + 'urban (word)`', "Searches the term in the urban dictionary.")
        .addField("`" + prefix + 'urban`', "Urban dictionary search a random search term.")
        .addField("`" + prefix + 'wish (statement)`', "Ask Johnny Cash a wish, and see if you're lucky.")
        .addField("`" + prefix + 'quiz`', "Do you have the brains to answer correctly to Johnny Cash's questions? Let's find out.")
        .addField("`" + prefix + 'rps (item)`', "Play a game of Rock, Paper, Scissors with Johnny Cash!")
        .addField("`" + prefix + 'ringoffire`', "Host a live Johnny Cash concert, where Johnny Cash himself will sing Ring Of Fire! *(lyrics sent at exact timings as recording)*")
        .addField("`" + prefix + 'bookcash`', "Play the official BookCash Adventures Deluxe!")
        .addField("`" + prefix + 'poll (question)`', "Set up a simple poll for everyone to vote on!")
        .addField("`" + prefix + 'NNN`', "See who has failed No Nut November!")
        .addField("`" + prefix + 'simprate (user)`', "See how much simp your friends are")
        .addField("`" + prefix + 'joke`', "Get a random joke")
        .addField("`" + prefix + 'dadjoke`', "Get a random dad joke")
        .addField("`" + prefix + 'snake`', "Play the classic game, Snake!")
        .addField("`" + prefix + 'connect4`', "Play Connect 4 with a friend!")
        .addField("`" + prefix + 'hangman`', "Play Hangman!")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(funEmbed)

    }

    if(message.content.toLowerCase() === prefix + "adminhelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const adminEmbed = new Discord.MessageEmbed()
        .setTitle('Administration Commands')
        .addField("`" + prefix + 'warn (user) (reason)`', "Warn a user for their bad behaviour. This will send a private message to them regarding their warning plus the reason.")
        .addField("`" + prefix + 'mute (user)`', "Mute a user.")
        .addField("`" + prefix + 'kick (user) (reason)`', "Kick a user for their bad behaviour.")
        .addField("`" + prefix + 'ban (user) (reason)`', "Ban a user for their bad behaviour.")
        .addField("`" + prefix + 'clear (amount)`', "Clear the amount of messages specified.")
        .addField("`" + prefix + 'report (user) (reason)`', "See any foolish behaviour? Help the admins out and report that vile user.")
        .addField("`" + prefix + 'fanny (user)`', "Fanny a user. **(ONLY WORKS ON CHEESE SERVER)**")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(adminEmbed)
    }
    
    
    if(message.content.toLowerCase() === prefix + "currencyhelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const currencyEmbed = new Discord.MessageEmbed()
        .setTitle('Currency Commands')
        .addField("`" + prefix + 'balance`', "This will show you your current balance, current cash.")
        .addField("`" + prefix + 'balance (user)`', "This will show you another user's balance and cash.")
        .addField("`" + prefix + 'daily`', "Claim your daily cash!")
        .addField("`" + prefix + 'rob (user) (amount)`', "Want some extra cash? Try and rob someone.")
        .addField("`" + prefix + 'pay (user) (amount)`', "Feeling generous? Donate some cash to your friends, or keep it all to yourself.")
        .addField("`" + prefix + 'gamble (amount)`', "Feeling lucky enough to gamble your money in the chance for some more money? Or possibly lose it all?")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(currencyEmbed)
    }
    
    if(message.content.toLowerCase() === prefix + "educationhelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const educationEmbed = new Discord.MessageEmbed()
        .setTitle('Educational Commands')
        .addField("`" + prefix + 'fact`', "Get a random fact about me.")
        .addField("`" + prefix + 'getadvice`', "Get some advice from Johnny Cash himself")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(educationEmbed)
    }
    
    if(message.content.toLowerCase() === prefix + "confighelp"){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const configEmbed = new Discord.MessageEmbed()
        .setTitle('Configuration Commands')
        .addField("`" + prefix + "set_im_joke ('true' or 'false')`", "Toggle if I should reply with the classic dad joke whenever a message starts with 'I'm'")
        .addField("`" + prefix + "prefix <PREFIX>`", "Set a custom server prefix")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(configEmbed)
    }
    
    var customDiscordJokes = require('custom-discord-jokes');
    
    if(message.content.toLowerCase().startsWith(prefix + "dadjoke")){
        customDiscordJokes.getRandomDadJoke(function(joke){
            message.channel.send(joke);
        })

    }
    
    if(message.content.toLowerCase().startsWith(prefix + "meme")){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        let data = await random.getMeme();
        message.channel.send(data);
    }

    if(message.content.toLowerCase().startsWith(prefix + "getadvice")){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        let data = await random.getAdvice();
        message.channel.send(data);
    }

    if(message.content.toLowerCase().startsWith(prefix + "joke")){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        let data = await random.getJoke();
        message.channel.send(data);
    }
   
    
    

    if(message.content.toLowerCase().startsWith(prefix + "cursed")){
        if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `ATTACH_FILES` option on me.");

        cursed(message);
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "image")){
        if(!message.guild.me.permissions.has("ATTACH_FILES")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `ATTACH_FILES` option on me.");
        let searchQuery = args.slice(1).join(" ")
        any(message, searchQuery)
    }
    
    if(message.content.toLowerCase().startsWith(prefix + "ringoffire")){
        if(ringoffirecooldown == true){
            if(message.author.bot) return
            ringoffirecooldown = false;
            var firstmsg = setTimeout(function(){verse1_line1(message)}, 4000)
            var secondmsg = setTimeout(function(){verse1_line2(message)}, 10000)
            var thirdmsg = setTimeout(function(){verse1_line3(message)}, 17000)
            var fourthmsg = setTimeout(function(){verse1_line4(message)}, 23000)
            var chorusmsg1 = setTimeout(function(){chorus1(message)}, 27000)
            var chorusmsg2 = setTimeout(function(){chorus2(message)}, 31000)
            var chorusmsg3 = setTimeout(function(){chorus3(message)}, 34000)
            var chorusmsg4 = setTimeout(function(){chorus4(message)}, 37500)
            var chorusmsg5 = setTimeout(function(){chorus5(message)}, 41000)
            var chorusmsg1rpt = setTimeout(function(){chorus1(message)}, 66000)
            var chorusmsg2rpt = setTimeout(function(){chorus2(message)}, 70000)
            var chorusmsg3rpt = setTimeout(function(){chorus3(message)}, 73000)
            var chorusmsg4rpt = setTimeout(function(){chorus4(message)}, 76500)
            var chorusmsg5rpt = setTimeout(function(){chorus5(message)}, 80000)
            var fifthmsg = setTimeout(function(){verse2_line1(message)}, 89000)
            var sixthmsg = setTimeout(function(){verse2_line2(message)}, 95000)
            var seventhmsg = setTimeout(function(){verse2_line3(message)}, 101500)
            var eigthmsg = setTimeout(function(){verse2_line4(message)}, 108500)
            var chorusmsg1rpt2 = setTimeout(function(){chorus1(message)}, 114000)
            var chorusmsg2rpt2 = setTimeout(function(){chorus2(message)}, 118000)
            var chorusmsg3rpt2 = setTimeout(function(){chorus3(message)}, 122000)
            var chorusmsg4rpt2 = setTimeout(function(){chorus4(message)}, 124500)
            var chorusmsg5rpt2 = setTimeout(function(){chorus5(message)}, 128000)
            var chorusmsg1rpt3 = setTimeout(function(){chorus1(message)}, 133500)
            var chorusmsg2rpt3 = setTimeout(function(){chorus2(message)}, 137500)
            var chorusmsg3rpt3 = setTimeout(function(){chorus3(message)}, 140500)
            var chorusmsg4rpt3 = setTimeout(function(){chorus4(message)}, 144000)
            var chorusmsg5rpt3 = setTimeout(function(){chorus5(message)}, 147500)
            var lastbitmsg1 = setTimeout(function(){lastbit_1(message)}, 156500)
            var lastbitmsg2 = setTimeout(function(){lastbit_2_and3(message)}, 160500)
            var lastbitmsg3 = setTimeout(function(){lastbit_2_and3(message)}, 164500)
            var lastbitmsg4 = setTimeout(function(){last_last(message)}, 168500)
            var setcooldown = setTimeout(function(){change_cooldown}, 168500)



            message.channel.send(`Im gonna play Ring Of Fire! This was suggested by, ${message.author.username}`).then(firstmsg).then(secondmsg).then(thirdmsg).then(fourthmsg).then(chorusmsg1).then(chorusmsg2).then(chorusmsg3).then(chorusmsg4).then(chorusmsg5).then(chorusmsg1rpt).then(chorusmsg2rpt).then(chorusmsg3rpt).then(chorusmsg4rpt).then(chorusmsg5rpt).then(fifthmsg).then(sixthmsg).then(seventhmsg).then(eigthmsg).then(chorusmsg1rpt2).then(chorusmsg2rpt2).then(chorusmsg3rpt2).then(chorusmsg4rpt2).then(chorusmsg5rpt2).then(chorusmsg1rpt3).then(chorusmsg2rpt3).then(chorusmsg3rpt3).then(chorusmsg4rpt3).then(chorusmsg5rpt3).then(lastbitmsg1).then(lastbitmsg2).then(lastbitmsg3).then(lastbitmsg4).then(setcooldown);
            
        }else{
            message.reply("A Ring Of Fire song is already playing")
        }
    }


    function verse1_line1(message){
        message.channel.send("Love is a burnin' thing,");
    }

    function verse1_line2(message){
        message.channel.send("And it makes a fiery ring");
    }

    function verse1_line3(message){
        message.channel.send("Bound by wild desire")
    }

    function verse1_line4(message){
        message.channel.send("I fell into a ring of fire.")
    }

    function chorus1(message){
        message.channel.send("I fell into a burnin' ring of fire")
    }

    function chorus2(message){
        message.channel.send("I went down, down, down")
    }

    function chorus3(message){
        message.channel.send("And the flames went higher,")
    }

    function chorus4(message){
        message.channel.send("And it burns, burns, burns,")
    }

    function chorus5(message){
        message.channel.send("The ring of fire, the ring of fire.")
    }

    function verse2_line1(message){
        message.channel.send("The taste of love is sweet")
    }

    function verse2_line2(message){
        message.channel.send("When hearts like ours meet.")
    }

    function verse2_line3(message){
        message.channel.send("I fell for you like a child")
    }

    function verse2_line4(message){
        message.channel.send("Oh, but the fire went wild.")
    }

    function lastbit_1(message){
        message.channel.send("And it burns, burns, burns,")
    }

    function lastbit_2_and3(message){
        message.channel.send("The ring of fire, the ring of fire.")
    }

    function last_last(message){
        message.channel.send("The ring of fire")
    }
    
    function change_cooldown(){
        ringoffirecooldown = true
    }

    if(message.content.toLowerCase().startsWith(prefix + "serverinfo")){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const { guild } = message

        const { name, region, memberCount, owner, createdAt } = guild
        const icon = guild.iconURL()

        const serverInfoEmbed = new MessageEmbed()
        .setTitle(`${name}'s Server Info`)
        .setThumbnail(icon)
        .addField("**Region:** ", region)
        .addField("**Members:** ", memberCount)
        .addField("**Owner:** ", owner.user.tag)
        .addField("**Server Created At:** ", createdAt)

        message.channel.send(serverInfoEmbed)

    }
    
    if(message.content.toUpperCase() === prefix + "NNN"){

        const date = new Date()
        const month = date.getMonth() + 1;
        
        if(month != 11) return message.channel.send("**It's not November, you can't use that command!**");

        const server = message.member.guild;
        console.log(server.members)
        const serverMembers = [];
        server.members.cache.forEach(member => serverMembers.push(member.nickname || member.user.username));

        const randomMember = serverMembers[Math.floor(Math.random() * serverMembers.length)];
        return message.channel.send(`**${randomMember} failed No Nut November!**`)
    }

    if(message.content.toLowerCase().startsWith(prefix + "userinfo")){
        if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to embedded messages. Please enable the `EMBED_LINKS` option on me.");
        const { guild, channel } = message

        const user = message.mentions.users.first() || message.member.user
        const member = guild.members.cache.get(user.id)

        rolesHave = []

        for(let role of member.roles.cache.values()){
            if(role.name != "@everyone"){
                rolesHave.push(role)
            }
            
        }
        
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const userInfoEmbed = new MessageEmbed()
        .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
        .addField("**User Tag:** ", user.tag)
        .addField("**Is Bot:** ", user.bot)
        .addField("**Nickname:** ", member.nickname || 'None')
        .addField("**Join Date:** ", new Date(member.joinedTimestamp).toLocaleDateString("en-US", options))
        .addField("**Account Created:** ", new Date(user.createdTimestamp).toLocaleDateString("en-US", options))
        .addField("**Role Count:** ", member.roles.cache.size - 1)
        .addField("**Roles:** ", rolesHave)

    
        message.channel.send(userInfoEmbed)

    }
    
      

        




    if (message.content.toLowerCase().startsWith(prefix + "ping")) {
        message.channel.send(`Ring Of Fire! my Ping is ` + Math.round(Client.ws.ping) + `ms`);
      }

    if(message.content.toLowerCase().startsWith(prefix + "hello")){
        message.channel.send("Hello, i am Johhny Cash. How are you doing, <@" + message.author.id + "> ?");

    }
    
    if(message.content.toLowerCase().startsWith(prefix + "test")){
        message.channel.send("You have utilised a test, " + message.author + " It went through!");

    }
    
    if(message.content.toUpperCase().startsWith(prefix + "ARGH")){
        message.reply("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    }
    
    

});



function cursed(message){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "cursed image",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    }

    request(options, function(error, response, responseBody) {
        if (error) {
            console.log(error)
            return message.channel.send("An error occurred, please try again")
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
 
        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
};

function any(message, search){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    }

    request(options, function(error, response, responseBody) {
        if (error) {
            console.log(error)
            return message.channel.send("An error occurred, please try again")
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
 
        if (!urls.length) {
           
            return message.channel.send("No images available for this search query!")
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
};

    




Client.login(process.env.BOT_TOKEN);
