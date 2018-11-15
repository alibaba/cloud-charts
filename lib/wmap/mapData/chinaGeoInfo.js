"use strict";

exports.__esModule = true;
var provinceName = exports.provinceName = {
  // 直辖市
  "北京市": "北京",
  "天津市": "天津",
  "上海市": "上海",
  "重庆市": "重庆",
  // 自治区
  "内蒙古自治区": "内蒙古",
  "广西壮族自治区": "广西",
  "西藏自治区": "西藏",
  "宁夏回族自治区": "宁夏",
  "新疆维吾尔自治区": "新疆",
  // 特别行政区
  "香港特別行政區": "香港",
  "澳门特别行政区": "澳门",

  "江西省": "江西",
  "河南省": "河南",
  "四川省": "四川",
  "贵州省": "贵州",
  "辽宁省": "辽宁",
  "山东省": "山东",
  "山西省": "山西",
  "浙江省": "浙江",
  "海南省": "海南",
  "陕西省": "陕西",
  "福建省": "福建",
  "青海省": "青海",
  "湖北省": "湖北",
  "甘肃省": "甘肃",
  "安徽省": "安徽",
  "台湾省": "台湾",
  "云南省": "云南",
  "黑龙江省": "黑龙江",
  "广东省": "广东",
  "湖南省": "湖南",
  "河北省": "河北",
  "吉林省": "吉林",
  "江苏省": "江苏"
};

var positionMap = exports.positionMap = {
  "云南省": { "lat": 25.04581, "lng": 102.71 },
  "内蒙古自治区": { "lat": 40.8175, "lng": 111.76562 },
  "吉林省": { "lat": 43.89654, "lng": 125.32599 },
  "四川省": { "lat": 30.65165, "lng": 104.07593 },
  "宁夏回族自治区": { "lat": 38.47132, "lng": 106.25875 },
  "安徽省": { "lat": 31.86118, "lng": 117.28492 },
  "山东省": { "lat": 36.66853, "lng": 117.02036 },
  "山西省": { "lat": 37.87353, "lng": 112.5624 },
  "广东省": { "lat": 23.13219, "lng": 113.26653 },
  "广西壮族自治区": { "lat": 22.81548, "lng": 108.32755 },
  "新疆维吾尔自治区": { "lat": 43.79303, "lng": 87.6277 },
  "江苏省": { "lat": 32.06171, "lng": 118.76323 },
  "江西省": { "lat": 28.6757, "lng": 115.90923 },
  "河北省": { "lat": 38.03706, "lng": 114.46866 },
  "河南省": { "lat": 34.76552, "lng": 113.7536 },
  "浙江省": { "lat": 30.26745, "lng": 120.15279 },
  "海南省": { "lat": 20.01738, "lng": 110.34923 },
  "湖北省": { "lat": 30.5465, "lng": 114.34186 },
  "湖南省": { "lat": 28.11244, "lng": 112.98381 },
  "甘肃省": { "lat": 36.05942, "lng": 103.82631 },
  "福建省": { "lat": 26.10078, "lng": 119.29514 },
  "贵州省": { "lat": 26.59819, "lng": 106.70741 },
  "辽宁省": { "lat": 41.83544, "lng": 123.4291 },
  "陕西省": { "lat": 34.26547, "lng": 108.95424 },
  "青海省": { "lat": 36.6209, "lng": 101.7802 },
  "黑龙江省": { "lat": 45.74237, "lng": 126.66166 },
  "西藏自治区": { "lat": 31.64946, "lng": 86.51326 },
  "台湾省": { "lat": 23.74205, "lng": 120.9814 },
  "重庆": {
    "lng": 107.7539,
    "lat": 30.1904,
    "fullName": "重庆市",
    "province": "重庆"
  },
  "北京": {
    "lng": 116.4551,
    "lat": 40.2539,
    "fullName": "北京市",
    "province": "北京"
  },
  "天津": {
    "lng": 117.4219,
    "lat": 39.4189,
    "fullName": "天津市",
    "province": "天津"
  },
  "上海": {
    "lng": 121.4648,
    "lat": 31.2891,
    "fullName": "上海市",
    "province": "上海"
  },
  "香港": {
    "lng": 114.2578,
    "lat": 22.3242,
    "fullName": "香港",
    "province": "香港"
  },
  "澳门": {
    "lng": 113.5547,
    "lat": 22.1484,
    "fullName": "澳门",
    "province": "澳门"
  },
  "巴音": {
    "lng": 88.1653,
    "lat": 39.6002,
    "fullName": "巴音郭楞蒙古自治州",
    "province": "新疆"
  },
  "和田": {
    "lng": 81.167,
    "lat": 36.9855,
    "fullName": "和田地区",
    "province": "新疆"
  },
  "哈密": {
    "lng": 93.7793,
    "lat": 42.9236,
    "fullName": "哈密地区",
    "province": "新疆"
  },
  "阿克": {
    "lng": 82.9797,
    "lat": 41.0229,
    "fullName": "阿克苏地区",
    "province": "新疆"
  },
  "阿勒": {
    "lng": 88.2971,
    "lat": 47.0929,
    "fullName": "阿勒泰地区",
    "province": "新疆"
  },
  "喀什": {
    "lng": 77.168,
    "lat": 37.8534,
    "fullName": "喀什地区",
    "province": "新疆"
  },
  "塔城": {
    "lng": 86.6272,
    "lat": 45.8514,
    "fullName": "塔城地区",
    "province": "新疆"
  },
  "昌吉": {
    "lng": 89.6814,
    "lat": 44.4507,
    "fullName": "昌吉回族自治州",
    "province": "新疆"
  },
  "克孜": {
    "lng": 74.6301,
    "lat": 39.5233,
    "fullName": "克孜勒苏柯尔克孜自治州",
    "province": "新疆"
  },
  "吐鲁": {
    "lng": 89.6375,
    "lat": 42.4127,
    "fullName": "吐鲁番地区",
    "province": "新疆"
  },
  "伊犁": {
    "lng": 82.5513,
    "lat": 43.5498,
    "fullName": "伊犁哈萨克自治州",
    "province": "新疆"
  },
  "博尔": {
    "lng": 81.8481,
    "lat": 44.6979,
    "fullName": "博尔塔拉蒙古自治州",
    "province": "新疆"
  },
  "乌鲁": {
    "lng": 87.9236,
    "lat": 43.5883,
    "fullName": "乌鲁木齐市",
    "province": "新疆"
  },
  "克拉": {
    "lng": 85.2869,
    "lat": 45.5054,
    "fullName": "克拉玛依市",
    "province": "新疆"
  },
  "阿拉尔": {
    "lng": 81.2769,
    "lat": 40.6549,
    "fullName": "阿拉尔市",
    "province": "新疆"
  },
  "图木": {
    "lng": 79.1345,
    "lat": 39.8749,
    "fullName": "图木舒克市",
    "province": "新疆"
  },
  "五家": {
    "lng": 87.5391,
    "lat": 44.3024,
    "fullName": "五家渠市",
    "province": "新疆"
  },
  "石河": {
    "lng": 86.0229,
    "lat": 44.2914,
    "fullName": "石河子市",
    "province": "新疆"
  },
  "那曲": {
    "lng": 88.1982,
    "lat": 33.3215,
    "fullName": "那曲地区",
    "province": "西藏"
  },
  "阿里": {
    "lng": 82.3645,
    "lat": 32.7667,
    "fullName": "阿里地区",
    "province": "西藏"
  },
  "日喀": {
    "lng": 86.2427,
    "lat": 29.5093,
    "fullName": "日喀则地区",
    "province": "西藏"
  },
  "林芝": {
    "lng": 95.4602,
    "lat": 29.1138,
    "fullName": "林芝地区",
    "province": "西藏"
  },
  "昌都": {
    "lng": 97.0203,
    "lat": 30.7068,
    "fullName": "昌都地区",
    "province": "西藏"
  },
  "山南": {
    "lng": 92.2083,
    "lat": 28.3392,
    "fullName": "山南地区",
    "province": "西藏"
  },
  "拉萨": {
    "lng": 91.1865,
    "lat": 30.1465,
    "fullName": "拉萨市",
    "province": "西藏"
  },
  "呼伦": {
    "lng": 120.8057,
    "lat": 50.2185,
    "fullName": "呼伦贝尔市",
    "province": "内蒙古"
  },
  "阿拉善": {
    "lng": 102.019,
    "lat": 40.1001,
    "fullName": "阿拉善盟",
    "province": "内蒙古"
  },
  "锡林": {
    "lng": 115.6421,
    "lat": 44.176,
    "fullName": "锡林郭勒盟",
    "province": "内蒙古"
  },
  "鄂尔": {
    "lng": 108.9734,
    "lat": 39.2487,
    "fullName": "鄂尔多斯市",
    "province": "内蒙古"
  },
  "赤峰": {
    "lng": 118.6743,
    "lat": 43.2642,
    "fullName": "赤峰市",
    "province": "内蒙古"
  },
  "巴彦": {
    "lng": 107.5562,
    "lat": 41.3196,
    "fullName": "巴彦淖尔市",
    "province": "内蒙古"
  },
  "通辽": {
    "lng": 121.4758,
    "lat": 43.9673,
    "fullName": "通辽市",
    "province": "内蒙古"
  },
  "乌兰": {
    "lng": 112.5769,
    "lat": 41.77,
    "fullName": "乌兰察布市",
    "province": "内蒙古"
  },
  "兴安": {
    "lng": 121.3879,
    "lat": 46.1426,
    "fullName": "兴安盟",
    "province": "内蒙古"
  },
  "包头": {
    "lng": 110.3467,
    "lat": 41.4899,
    "fullName": "包头市",
    "province": "内蒙古"
  },
  "呼和": {
    "lng": 111.4124,
    "lat": 40.4901,
    "fullName": "呼和浩特市",
    "province": "内蒙古"
  },
  "乌海": {
    "lng": 106.886,
    "lat": 39.4739,
    "fullName": "乌海市",
    "province": "内蒙古"
  },
  "海西": {
    "lng": 94.9768,
    "lat": 37.1118,
    "fullName": "海西蒙古族藏族自治州",
    "province": "青海"
  },
  "玉树": {
    "lng": 93.5925,
    "lat": 33.9368,
    "fullName": "玉树藏族自治州",
    "province": "青海"
  },
  "果洛": {
    "lng": 99.3823,
    "lat": 34.0466,
    "fullName": "果洛藏族自治州",
    "province": "青海"
  },
  "海南": {
    "lng": 100.3711,
    "lat": 35.9418,
    "fullName": "海南藏族自治州",
    "province": "青海"
  },
  "海北": {
    "lng": 100.3711,
    "lat": 37.9138,
    "fullName": "海北藏族自治州",
    "province": "青海"
  },
  "黄南": {
    "lng": 101.5686,
    "lat": 35.1178,
    "fullName": "黄南藏族自治州",
    "province": "青海"
  },
  "海东": {
    "lng": 102.3706,
    "lat": 36.2988,
    "fullName": "海东地区",
    "province": "青海"
  },
  "西宁": {
    "lng": 101.4038,
    "lat": 36.8207,
    "fullName": "西宁市",
    "province": "青海"
  },
  "甘孜": {
    "lng": 99.9207,
    "lat": 31.0803,
    "fullName": "甘孜藏族自治州",
    "province": "四川"
  },
  "阿坝": {
    "lng": 102.4805,
    "lat": 32.4536,
    "fullName": "阿坝藏族羌族自治州",
    "province": "四川"
  },
  "凉山": {
    "lng": 101.9641,
    "lat": 27.6746,
    "fullName": "凉山彝族自治州",
    "province": "四川"
  },
  "绵阳": {
    "lng": 104.7327,
    "lat": 31.8713,
    "fullName": "绵阳市",
    "province": "四川"
  },
  "达州": {
    "lng": 107.6111,
    "lat": 31.333,
    "fullName": "达州市",
    "province": "四川"
  },
  "广元": {
    "lng": 105.6885,
    "lat": 32.2284,
    "fullName": "广元市",
    "province": "四川"
  },
  "雅安": {
    "lng": 102.6672,
    "lat": 29.8938,
    "fullName": "雅安市",
    "province": "四川"
  },
  "宜宾": {
    "lng": 104.6558,
    "lat": 28.548,
    "fullName": "宜宾市",
    "province": "四川"
  },
  "乐山": {
    "lng": 103.5791,
    "lat": 29.1742,
    "fullName": "乐山市",
    "province": "四川"
  },
  "南充": {
    "lng": 106.2048,
    "lat": 31.1517,
    "fullName": "南充市",
    "province": "四川"
  },
  "巴中": {
    "lng": 107.0618,
    "lat": 31.9977,
    "fullName": "巴中市",
    "province": "四川"
  },
  "泸州": {
    "lng": 105.4578,
    "lat": 28.493,
    "fullName": "泸州市",
    "province": "四川"
  },
  "成都": {
    "lng": 103.9526,
    "lat": 30.7617,
    "fullName": "成都市",
    "province": "四川"
  },
  "资阳": {
    "lng": 104.9744,
    "lat": 30.1575,
    "fullName": "资阳市",
    "province": "四川"
  },
  "攀枝": {
    "lng": 101.6895,
    "lat": 26.7133,
    "fullName": "攀枝花市",
    "province": "四川"
  },
  "眉山": {
    "lng": 103.8098,
    "lat": 30.0146,
    "fullName": "眉山市",
    "province": "四川"
  },
  "广安": {
    "lng": 106.6333,
    "lat": 30.4376,
    "fullName": "广安市",
    "province": "四川"
  },
  "德阳": {
    "lng": 104.48,
    "lat": 31.1133,
    "fullName": "德阳市",
    "province": "四川"
  },
  "内江": {
    "lng": 104.8535,
    "lat": 29.6136,
    "fullName": "内江市",
    "province": "四川"
  },
  "遂宁": {
    "lng": 105.5347,
    "lat": 30.6683,
    "fullName": "遂宁市",
    "province": "四川"
  },
  "自贡": {
    "lng": 104.6667,
    "lat": 29.2786,
    "fullName": "自贡市",
    "province": "四川"
  },
  "黑河": {
    "lng": 127.1448,
    "lat": 49.2957,
    "fullName": "黑河市",
    "province": "黑龙江"
  },
  "大兴": {
    "lng": 124.1016,
    "lat": 52.2345,
    "fullName": "大兴安岭地区",
    "province": "黑龙江"
  },
  "哈尔": {
    "lng": 127.9688,
    "lat": 45.368,
    "fullName": "哈尔滨市",
    "province": "黑龙江"
  },
  "齐齐": {
    "lng": 124.541,
    "lat": 47.5818,
    "fullName": "齐齐哈尔市",
    "province": "黑龙江"
  },
  "牡丹": {
    "lng": 129.7815,
    "lat": 44.7089,
    "fullName": "牡丹江市",
    "province": "黑龙江"
  },
  "绥化": {
    "lng": 126.7163,
    "lat": 46.8018,
    "fullName": "绥化市",
    "province": "黑龙江"
  },
  "伊春": {
    "lng": 129.1992,
    "lat": 47.9608,
    "fullName": "伊春市",
    "province": "黑龙江"
  },
  "佳木": {
    "lng": 133.0005,
    "lat": 47.5763,
    "fullName": "佳木斯市",
    "province": "黑龙江"
  },
  "鸡西": {
    "lng": 132.7917,
    "lat": 45.7361,
    "fullName": "鸡西市",
    "province": "黑龙江"
  },
  "双鸭": {
    "lng": 133.5938,
    "lat": 46.7523,
    "fullName": "双鸭山市",
    "province": "黑龙江"
  },
  "大庆": {
    "lng": 124.7717,
    "lat": 46.4282,
    "fullName": "大庆市",
    "province": "黑龙江"
  },
  "鹤岗": {
    "lng": 130.4407,
    "lat": 47.7081,
    "fullName": "鹤岗市",
    "province": "黑龙江"
  },
  "七台": {
    "lng": 131.2756,
    "lat": 45.9558,
    "fullName": "七台河市",
    "province": "黑龙江"
  },
  "酒泉": {
    "lng": 96.2622,
    "lat": 40.4517,
    "fullName": "酒泉市",
    "province": "甘肃"
  },
  "张掖": {
    "lng": 99.7998,
    "lat": 38.7433,
    "fullName": "张掖市",
    "province": "甘肃"
  },
  "甘南": {
    "lng": 102.9199,
    "lat": 34.6893,
    "fullName": "甘南藏族自治州",
    "province": "甘肃"
  },
  "武威": {
    "lng": 103.0188,
    "lat": 38.1061,
    "fullName": "武威市",
    "province": "甘肃"
  },
  "陇南": {
    "lng": 105.304,
    "lat": 33.5632,
    "fullName": "陇南市",
    "province": "甘肃"
  },
  "庆阳": {
    "lng": 107.5342,
    "lat": 36.2,
    "fullName": "庆阳市",
    "province": "甘肃"
  },
  "白银": {
    "lng": 104.8645,
    "lat": 36.5076,
    "fullName": "白银市",
    "province": "甘肃"
  },
  "定西": {
    "lng": 104.5569,
    "lat": 35.0848,
    "fullName": "定西市",
    "province": "甘肃"
  },
  "天水": {
    "lng": 105.6445,
    "lat": 34.6289,
    "fullName": "天水市",
    "province": "甘肃"
  },
  "兰州": {
    "lng": 103.5901,
    "lat": 36.3043,
    "fullName": "兰州市",
    "province": "甘肃"
  },
  "平凉": {
    "lng": 107.0728,
    "lat": 35.321,
    "fullName": "平凉市",
    "province": "甘肃"
  },
  "临夏": {
    "lng": 103.2715,
    "lat": 35.5737,
    "fullName": "临夏回族自治州",
    "province": "甘肃"
  },
  "金昌": {
    "lng": 102.074,
    "lat": 38.5126,
    "fullName": "金昌市",
    "province": "甘肃"
  },
  "嘉峪": {
    "lng": 98.1738,
    "lat": 39.8035,
    "fullName": "嘉峪关市",
    "province": "甘肃"
  },
  "普洱": {
    "lng": 100.7446,
    "lat": 23.4229,
    "fullName": "普洱市",
    "province": "云南"
  },
  "红河": {
    "lng": 103.0408,
    "lat": 23.6041,
    "fullName": "红河哈尼族彝族自治州",
    "province": "云南"
  },
  "文山": {
    "lng": 104.8865,
    "lat": 23.5712,
    "fullName": "文山壮族苗族自治州",
    "province": "云南"
  },
  "曲靖": {
    "lng": 103.9417,
    "lat": 25.7025,
    "fullName": "曲靖市",
    "province": "云南"
  },
  "楚雄": {
    "lng": 101.6016,
    "lat": 25.3619,
    "fullName": "楚雄彝族自治州",
    "province": "云南"
  },
  "大理": {
    "lng": 99.9536,
    "lat": 25.6805,
    "fullName": "大理白族自治州",
    "province": "云南"
  },
  "临沧": {
    "lng": 99.613,
    "lat": 24.0546,
    "fullName": "临沧市",
    "province": "云南"
  },
  "迪庆": {
    "lng": 99.4592,
    "lat": 27.9327,
    "fullName": "迪庆藏族自治州",
    "province": "云南"
  },
  "昭通": {
    "lng": 104.0955,
    "lat": 27.6031,
    "fullName": "昭通市",
    "province": "云南"
  },
  "昆明": {
    "lng": 102.9199,
    "lat": 25.4663,
    "fullName": "昆明市",
    "province": "云南"
  },
  "丽江": {
    "lng": 100.448,
    "lat": 26.955,
    "fullName": "丽江市",
    "province": "云南"
  },
  "西双": {
    "lng": 100.8984,
    "lat": 21.8628,
    "fullName": "西双版纳傣族自治州",
    "province": "云南"
  },
  "保山": {
    "lng": 99.0637,
    "lat": 24.9884,
    "fullName": "保山市",
    "province": "云南"
  },
  "玉溪": {
    "lng": 101.9312,
    "lat": 23.8898,
    "fullName": "玉溪市",
    "province": "云南"
  },
  "怒江": {
    "lng": 99.1516,
    "lat": 26.5594,
    "fullName": "怒江傈僳族自治州",
    "province": "云南"
  },
  "德宏": {
    "lng": 98.1299,
    "lat": 24.5874,
    "fullName": "德宏傣族景颇族自治州",
    "province": "云南"
  },
  "百色": {
    "lng": 106.6003,
    "lat": 23.9227,
    "fullName": "百色市",
    "province": "广西"
  },
  "河池": {
    "lng": 107.8638,
    "lat": 24.5819,
    "fullName": "河池市",
    "province": "广西"
  },
  "桂林": {
    "lng": 110.5554,
    "lat": 25.318,
    "fullName": "桂林市",
    "province": "广西"
  },
  "南宁": {
    "lng": 108.479,
    "lat": 23.1152,
    "fullName": "南宁市",
    "province": "广西"
  },
  "柳州": {
    "lng": 109.3799,
    "lat": 24.9774,
    "fullName": "柳州市",
    "province": "广西"
  },
  "崇左": {
    "lng": 107.3364,
    "lat": 22.4725,
    "fullName": "崇左市",
    "province": "广西"
  },
  "来宾": {
    "lng": 109.7095,
    "lat": 23.8403,
    "fullName": "来宾市",
    "province": "广西"
  },
  "玉林": {
    "lng": 110.2148,
    "lat": 22.3792,
    "fullName": "玉林市",
    "province": "广西"
  },
  "梧州": {
    "lng": 110.9949,
    "lat": 23.5052,
    "fullName": "梧州市",
    "province": "广西"
  },
  "贺州": {
    "lng": 111.3135,
    "lat": 24.4006,
    "fullName": "贺州市",
    "province": "广西"
  },
  "钦州": {
    "lng": 109.0283,
    "lat": 22.0935,
    "fullName": "钦州市",
    "province": "广西"
  },
  "贵港": {
    "lng": 109.9402,
    "lat": 23.3459,
    "fullName": "贵港市",
    "province": "广西"
  },
  "防城": {
    "lng": 108.0505,
    "lat": 21.9287,
    "fullName": "防城港市",
    "province": "广西"
  },
  "北海": {
    "lng": 109.314,
    "lat": 21.6211,
    "fullName": "北海市",
    "province": "广西"
  },
  "怀化": {
    "lng": 109.9512,
    "lat": 27.4438,
    "fullName": "怀化市",
    "province": "湖南"
  },
  "永州": {
    "lng": 111.709,
    "lat": 25.752,
    "fullName": "永州市",
    "province": "湖南"
  },
  "邵阳": {
    "lng": 110.9619,
    "lat": 26.8121,
    "fullName": "邵阳市",
    "province": "湖南"
  },
  "郴州": {
    "lng": 113.2361,
    "lat": 25.8673,
    "fullName": "郴州市",
    "province": "湖南"
  },
  "常德": {
    "lng": 111.4014,
    "lat": 29.2676,
    "fullName": "常德市",
    "province": "湖南"
  },
  "湘西": {
    "lng": 109.7864,
    "lat": 28.6743,
    "fullName": "湘西土家族苗族自治州"
  },
  "衡阳": {
    "lng": 112.4121,
    "lat": 26.7902,
    "fullName": "衡阳市",
    "province": "湖南"
  },
  "岳阳": {
    "lng": 113.2361,
    "lat": 29.1357,
    "fullName": "岳阳市",
    "province": "湖南"
  },
  "益阳": {
    "lng": 111.731,
    "lat": 28.3832,
    "fullName": "益阳市",
    "province": "湖南"
  },
  "长沙": {
    "lng": 113.0823,
    "lat": 28.2568,
    "fullName": "长沙市",
    "province": "湖南"
  },
  "株洲": {
    "lng": 113.5327,
    "lat": 27.0319,
    "fullName": "株洲市",
    "province": "湖南"
  },
  "张家界": {
    "lng": 110.5115,
    "lat": 29.328,
    "fullName": "张家界市",
    "province": "湖南"
  },
  "娄底": {
    "lng": 111.6431,
    "lat": 27.7185,
    "fullName": "娄底市",
    "province": "湖南"
  },
  "湘潭": {
    "lng": 112.5439,
    "lat": 27.7075,
    "fullName": "湘潭市",
    "province": "湖南"
  },
  "榆林": {
    "lng": 109.8743,
    "lat": 38.205,
    "fullName": "榆林市",
    "province": "陕西"
  },
  "延安": {
    "lng": 109.1052,
    "lat": 36.4252,
    "fullName": "延安市",
    "province": "陕西"
  },
  "汉中": {
    "lng": 106.886,
    "lat": 33.0139,
    "fullName": "汉中市",
    "province": "陕西"
  },
  "安康": {
    "lng": 109.1162,
    "lat": 32.7722,
    "fullName": "安康市",
    "province": "陕西"
  },
  "商洛": {
    "lng": 109.8083,
    "lat": 33.761,
    "fullName": "商洛市",
    "province": "陕西"
  },
  "宝鸡": {
    "lng": 107.1826,
    "lat": 34.3433,
    "fullName": "宝鸡市",
    "province": "陕西"
  },
  "渭南": {
    "lng": 109.7864,
    "lat": 35.0299,
    "fullName": "渭南市",
    "province": "陕西"
  },
  "咸阳": {
    "lng": 108.4131,
    "lat": 34.8706,
    "fullName": "咸阳市",
    "province": "陕西"
  },
  "西安": {
    "lng": 109.1162,
    "lat": 34.2004,
    "fullName": "西安市",
    "province": "陕西"
  },
  "铜川": {
    "lng": 109.0393,
    "lat": 35.1947,
    "fullName": "铜川市",
    "province": "陕西"
  },
  "清远": {
    "lng": 112.9175,
    "lat": 24.3292,
    "fullName": "清远市",
    "province": "广东"
  },
  "韶关": {
    "lng": 113.7964,
    "lat": 24.7028,
    "fullName": "韶关市",
    "province": "广东"
  },
  "湛江": {
    "lng": 110.3577,
    "lat": 20.9894,
    "fullName": "湛江市",
    "province": "广东"
  },
  "梅州": {
    "lng": 116.1255,
    "lat": 24.1534,
    "fullName": "梅州市",
    "province": "广东"
  },
  "河源": {
    "lng": 114.917,
    "lat": 23.9722,
    "fullName": "河源市",
    "province": "广东"
  },
  "肇庆": {
    "lng": 112.1265,
    "lat": 23.5822,
    "fullName": "肇庆市",
    "province": "广东"
  },
  "惠州": {
    "lng": 114.6204,
    "lat": 23.1647,
    "fullName": "惠州市",
    "province": "广东"
  },
  "茂名": {
    "lng": 111.0059,
    "lat": 22.0221,
    "fullName": "茂名市",
    "province": "广东"
  },
  "江门": {
    "lng": 112.6318,
    "lat": 22.1484,
    "fullName": "江门市",
    "province": "广东"
  },
  "阳江": {
    "lng": 111.8298,
    "lat": 22.0715,
    "fullName": "阳江市",
    "province": "广东"
  },
  "云浮": {
    "lng": 111.7859,
    "lat": 22.8516,
    "fullName": "云浮市",
    "province": "广东"
  },
  "广州": {
    "lng": 113.5107,
    "lat": 23.2196,
    "fullName": "广州市",
    "province": "广东"
  },
  "汕尾": {
    "lng": 115.5762,
    "lat": 23.0438,
    "fullName": "汕尾市",
    "province": "广东"
  },
  "揭阳": {
    "lng": 116.1255,
    "lat": 23.313,
    "fullName": "揭阳市",
    "province": "广东"
  },
  "珠海": {
    "lng": 113.7305,
    "lat": 22.1155,
    "fullName": "珠海市",
    "province": "广东"
  },
  "佛山": {
    "lng": 112.8955,
    "lat": 23.1097,
    "fullName": "佛山市",
    "province": "广东"
  },
  "潮州": {
    "lng": 116.7847,
    "lat": 23.8293,
    "fullName": "潮州市",
    "province": "广东"
  },
  "汕头": {
    "lng": 117.1692,
    "lat": 23.3405,
    "fullName": "汕头市",
    "province": "广东"
  },
  "深圳": {
    "lng": 114.5435,
    "lat": 22.5439,
    "fullName": "深圳市",
    "province": "广东"
  },
  "东莞": {
    "lng": 113.8953,
    "lat": 22.901,
    "fullName": "东莞市",
    "province": "广东"
  },
  "中山": {
    "lng": 113.4229,
    "lat": 22.478,
    "fullName": "中山市",
    "province": "广东"
  },
  "延边": {
    "lng": 129.397,
    "lat": 43.2587,
    "fullName": "延边朝鲜族自治州",
    "province": "吉林"
  },
  "吉林": {
    "lng": 126.8372,
    "lat": 43.6047,
    "fullName": "吉林市",
    "province": "吉林"
  },
  "白城": {
    "lng": 123.0029,
    "lat": 45.2637,
    "fullName": "白城市",
    "province": "吉林"
  },
  "松原": {
    "lng": 124.0906,
    "lat": 44.7198,
    "fullName": "松原市",
    "province": "吉林"
  },
  "长春": {
    "lng": 125.8154,
    "lat": 44.2584,
    "fullName": "长春市",
    "province": "吉林"
  },
  "白山": {
    "lng": 127.2217,
    "lat": 42.0941,
    "fullName": "白山市",
    "province": "吉林"
  },
  "通化": {
    "lng": 125.9583,
    "lat": 41.8579,
    "fullName": "通化市",
    "province": "吉林"
  },
  "四平": {
    "lng": 124.541,
    "lat": 43.4894,
    "fullName": "四平市",
    "province": "吉林"
  },
  "辽源": {
    "lng": 125.343,
    "lat": 42.7643,
    "fullName": "辽源市",
    "province": "吉林"
  },
  "承德": {
    "lng": 117.5757,
    "lat": 41.4075,
    "fullName": "承德市",
    "province": "河北"
  },
  "张家口": {
    "lng": 115.1477,
    "lat": 40.8527,
    "fullName": "张家口市",
    "province": "河北"
  },
  "保定": {
    "lng": 115.0488,
    "lat": 39.0948,
    "fullName": "保定市",
    "province": "河北"
  },
  "唐山": {
    "lng": 118.4766,
    "lat": 39.6826,
    "fullName": "唐山市",
    "province": "河北"
  },
  "沧州": {
    "lng": 116.8286,
    "lat": 38.2104,
    "fullName": "沧州市",
    "province": "河北"
  },
  "石家": {
    "lng": 114.4995,
    "lat": 38.1006,
    "fullName": "石家庄市",
    "province": "河北"
  },
  "邢台": {
    "lng": 114.8071,
    "lat": 37.2821,
    "fullName": "邢台市",
    "province": "河北"
  },
  "邯郸": {
    "lng": 114.4775,
    "lat": 36.535,
    "fullName": "邯郸市",
    "province": "河北"
  },
  "秦皇": {
    "lng": 119.2126,
    "lat": 40.0232,
    "fullName": "秦皇岛市",
    "province": "河北"
  },
  "衡水": {
    "lng": 115.8838,
    "lat": 37.7161,
    "fullName": "衡水市",
    "province": "河北"
  },
  "廊坊": {
    "lng": 116.521,
    "lat": 39.0509,
    "fullName": "廊坊市",
    "province": "河北"
  },
  "恩施": {
    "lng": 109.5007,
    "lat": 30.2563,
    "fullName": "恩施土家族苗族自治州",
    "province": "湖北"
  },
  "十堰": {
    "lng": 110.5115,
    "lat": 32.3877,
    "fullName": "十堰市",
    "province": "湖北"
  },
  "宜昌": {
    "lng": 111.1707,
    "lat": 30.7617,
    "fullName": "宜昌市",
    "province": "湖北"
  },
  "襄樊": {
    "lng": 111.9397,
    "lat": 31.9263,
    "fullName": "襄樊市",
    "province": "湖北"
  },
  "黄冈": {
    "lng": 115.2686,
    "lat": 30.6628,
    "fullName": "黄冈市",
    "province": "湖北"
  },
  "荆州": {
    "lng": 113.291,
    "lat": 30.0092,
    "fullName": "荆州市",
    "province": "湖北"
  },
  "荆门": {
    "lng": 112.6758,
    "lat": 30.9979,
    "fullName": "荆门市",
    "province": "湖北"
  },
  "咸宁": {
    "lng": 114.2578,
    "lat": 29.6631,
    "fullName": "咸宁市",
    "province": "湖北"
  },
  "随州": {
    "lng": 113.4338,
    "lat": 31.8768,
    "fullName": "随州市",
    "province": "湖北"
  },
  "孝感": {
    "lng": 113.9502,
    "lat": 31.1188,
    "fullName": "孝感市",
    "province": "湖北"
  },
  "武汉": {
    "lng": 114.3896,
    "lat": 30.6628,
    "fullName": "武汉市",
    "province": "湖北"
  },
  "黄石": {
    "lng": 115.0159,
    "lat": 29.9213,
    "fullName": "黄石市",
    "province": "湖北"
  },
  "神农": {
    "lng": 110.4565,
    "lat": 31.5802,
    "fullName": "神农架林区",
    "province": "湖北"
  },
  "天门": {
    "lng": 113.0273,
    "lat": 30.6409,
    "fullName": "天门市",
    "province": "湖北"
  },
  "仙桃": {
    "lng": 113.3789,
    "lat": 30.3003,
    "fullName": "仙桃市",
    "province": "湖北"
  },
  "潜江": {
    "lng": 112.7637,
    "lat": 30.3607,
    "fullName": "潜江市",
    "province": "湖北"
  },
  "鄂州": {
    "lng": 114.7302,
    "lat": 30.4102,
    "fullName": "鄂州市",
    "province": "湖北"
  },
  "遵义": {
    "lng": 106.908,
    "lat": 28.1744,
    "fullName": "遵义市",
    "province": "贵州"
  },
  "黔东": {
    "lng": 108.4241,
    "lat": 26.4166,
    "fullName": "黔东南苗族侗族自治州",
    "province": "贵州"
  },
  "毕节": {
    "lng": 105.1611,
    "lat": 27.0648,
    "fullName": "毕节地区",
    "province": "贵州"
  },
  "黔南": {
    "lng": 107.2485,
    "lat": 25.8398,
    "fullName": "黔南布依族苗族自治州",
    "province": "贵州"
  },
  "铜仁": {
    "lng": 108.6218,
    "lat": 28.0096,
    "fullName": "铜仁地区",
    "province": "贵州"
  },
  "黔西": {
    "lng": 105.5347,
    "lat": 25.3949,
    "fullName": "黔西南布依族苗族自治州",
    "province": "贵州"
  },
  "六盘": {
    "lng": 104.7546,
    "lat": 26.0925,
    "fullName": "六盘水市",
    "province": "贵州"
  },
  "安顺": {
    "lng": 105.9082,
    "lat": 25.9882,
    "fullName": "安顺市",
    "province": "贵州"
  },
  "贵阳": {
    "lng": 106.6992,
    "lat": 26.7682,
    "fullName": "贵阳市",
    "province": "贵州"
  },
  "烟台": {
    "lng": 120.7397,
    "lat": 37.5128,
    "fullName": "烟台市",
    "province": "山东"
  },
  "临沂": {
    "lng": 118.3118,
    "lat": 35.2936,
    "fullName": "临沂市",
    "province": "山东"
  },
  "潍坊": {
    "lng": 119.0918,
    "lat": 36.524,
    "fullName": "潍坊市",
    "province": "山东"
  },
  "青岛": {
    "lng": 120.4651,
    "lat": 36.3373,
    "fullName": "青岛市",
    "province": "山东"
  },
  "菏泽": {
    "lng": 115.6201,
    "lat": 35.2057,
    "fullName": "菏泽市",
    "province": "山东"
  },
  "济宁": {
    "lng": 116.8286,
    "lat": 35.3375,
    "fullName": "济宁市",
    "province": "山东"
  },
  "德州": {
    "lng": 116.6858,
    "lat": 37.2107,
    "fullName": "德州市",
    "province": "山东"
  },
  "滨州": {
    "lng": 117.8174,
    "lat": 37.4963,
    "fullName": "滨州市",
    "province": "山东"
  },
  "聊城": {
    "lng": 115.9167,
    "lat": 36.4032,
    "fullName": "聊城市",
    "province": "山东"
  },
  "东营": {
    "lng": 118.7073,
    "lat": 37.5513,
    "fullName": "东营市",
    "province": "山东"
  },
  "济南": {
    "lng": 117.1582,
    "lat": 36.8701,
    "fullName": "济南市",
    "province": "山东"
  },
  "泰安": {
    "lng": 117.0264,
    "lat": 36.0516,
    "fullName": "泰安市",
    "province": "山东"
  },
  "威海": {
    "lng": 121.9482,
    "lat": 37.1393,
    "fullName": "威海市",
    "province": "山东"
  },
  "日照": {
    "lng": 119.2786,
    "lat": 35.5023,
    "fullName": "日照市",
    "province": "山东"
  },
  "淄博": {
    "lng": 118.0371,
    "lat": 36.6064,
    "fullName": "淄博市",
    "province": "山东"
  },
  "枣庄": {
    "lng": 117.323,
    "lat": 34.8926,
    "fullName": "枣庄市",
    "province": "山东"
  },
  "莱芜": {
    "lng": 117.6526,
    "lat": 36.2714,
    "fullName": "莱芜市",
    "province": "山东"
  },
  "赣州": {
    "lng": 115.2795,
    "lat": 25.8124,
    "fullName": "赣州市",
    "province": "江西"
  },
  "吉安": {
    "lng": 114.884,
    "lat": 26.9659,
    "fullName": "吉安市",
    "province": "江西"
  },
  "上饶": {
    "lng": 117.8613,
    "lat": 28.7292,
    "fullName": "上饶市",
    "province": "江西"
  },
  "九江": {
    "lng": 115.4224,
    "lat": 29.3774,
    "fullName": "九江市",
    "province": "江西"
  },
  "抚州": {
    "lng": 116.4441,
    "lat": 27.4933,
    "fullName": "抚州市",
    "province": "江西"
  },
  "宜春": {
    "lng": 115.0159,
    "lat": 28.3228,
    "fullName": "宜春市",
    "province": "江西"
  },
  "南昌": {
    "lng": 116.0046,
    "lat": 28.6633,
    "fullName": "南昌市",
    "province": "江西"
  },
  "景德": {
    "lng": 117.334,
    "lat": 29.3225,
    "fullName": "景德镇市",
    "province": "江西"
  },
  "萍乡": {
    "lng": 113.9282,
    "lat": 27.4823,
    "fullName": "萍乡市",
    "province": "江西"
  },
  "鹰潭": {
    "lng": 117.0813,
    "lat": 28.2349,
    "fullName": "鹰潭市",
    "province": "江西"
  },
  "新余": {
    "lng": 114.95,
    "lat": 27.8174,
    "fullName": "新余市",
    "province": "江西"
  },
  "南阳": {
    "lng": 112.4011,
    "lat": 33.0359,
    "fullName": "南阳市",
    "province": "河南"
  },
  "信阳": {
    "lng": 114.8291,
    "lat": 32.0197,
    "fullName": "信阳市",
    "province": "河南"
  },
  "洛阳": {
    "lng": 112.0605,
    "lat": 34.3158,
    "fullName": "洛阳市",
    "province": "河南"
  },
  "驻马": {
    "lng": 114.1589,
    "lat": 32.9041,
    "fullName": "驻马店市",
    "province": "河南"
  },
  "周口": {
    "lng": 114.873,
    "lat": 33.6951,
    "fullName": "周口市",
    "province": "河南"
  },
  "商丘": {
    "lng": 115.741,
    "lat": 34.2828,
    "fullName": "商丘市",
    "province": "河南"
  },
  "三门": {
    "lng": 110.8301,
    "lat": 34.3158,
    "fullName": "三门峡市",
    "province": "河南"
  },
  "新乡": {
    "lng": 114.2029,
    "lat": 35.3595,
    "fullName": "新乡市",
    "province": "河南"
  },
  "平顶": {
    "lng": 112.9724,
    "lat": 33.739,
    "fullName": "平顶山市",
    "province": "河南"
  },
  "郑州": {
    "lng": 113.4668,
    "lat": 34.6234,
    "fullName": "郑州市",
    "province": "河南"
  },
  "安阳": {
    "lng": 114.5325,
    "lat": 36.0022,
    "fullName": "安阳市",
    "province": "河南"
  },
  "开封": {
    "lng": 114.5764,
    "lat": 34.6124,
    "fullName": "开封市",
    "province": "河南"
  },
  "焦作": {
    "lng": 112.8406,
    "lat": 35.1508,
    "fullName": "焦作市",
    "province": "河南"
  },
  "济源": {
    "lng": 112.3571,
    "lat": 35.0849,
    "fullName": "济源市",
    "province": "河南"
  },
  "许昌": {
    "lng": 113.6975,
    "lat": 34.0466,
    "fullName": "许昌市",
    "province": "河南"
  },
  "濮阳": {
    "lng": 115.1917,
    "lat": 35.799,
    "fullName": "濮阳市",
    "province": "河南"
  },
  "漯河": {
    "lng": 113.8733,
    "lat": 33.6951,
    "fullName": "漯河市",
    "province": "河南"
  },
  "鹤壁": {
    "lng": 114.3787,
    "lat": 35.744,
    "fullName": "鹤壁市",
    "province": "河南"
  },
  "大连": {
    "lng": 122.2229,
    "lat": 39.4409,
    "fullName": "大连市",
    "province": "辽宁"
  },
  "朝阳": {
    "lng": 120.0696,
    "lat": 41.4899,
    "fullName": "朝阳市",
    "province": "辽宁"
  },
  "丹东": {
    "lng": 124.541,
    "lat": 40.4242,
    "fullName": "丹东市",
    "province": "辽宁"
  },
  "铁岭": {
    "lng": 124.2773,
    "lat": 42.7423,
    "fullName": "铁岭市",
    "province": "辽宁"
  },
  "沈阳": {
    "lng": 123.1238,
    "lat": 42.1216,
    "fullName": "沈阳市",
    "province": "辽宁"
  },
  "抚顺": {
    "lng": 124.585,
    "lat": 41.8579,
    "fullName": "抚顺市",
    "province": "辽宁"
  },
  "葫芦": {
    "lng": 120.1575,
    "lat": 40.578,
    "fullName": "葫芦岛市",
    "province": "辽宁"
  },
  "阜新": {
    "lng": 122.0032,
    "lat": 42.2699,
    "fullName": "阜新市",
    "province": "辽宁"
  },
  "锦州": {
    "lng": 121.6626,
    "lat": 41.4294,
    "fullName": "锦州市",
    "province": "辽宁"
  },
  "鞍山": {
    "lng": 123.0798,
    "lat": 40.6055,
    "fullName": "鞍山市",
    "province": "辽宁"
  },
  "本溪": {
    "lng": 124.1455,
    "lat": 41.1987,
    "fullName": "本溪市",
    "province": "辽宁"
  },
  "营口": {
    "lng": 122.4316,
    "lat": 40.4297,
    "fullName": "营口市",
    "province": "辽宁"
  },
  "辽阳": {
    "lng": 123.4094,
    "lat": 41.1383,
    "fullName": "辽阳市",
    "province": "辽宁"
  },
  "盘锦": {
    "lng": 121.9482,
    "lat": 41.0449,
    "fullName": "盘锦市",
    "province": "辽宁"
  },
  "忻州": {
    "lng": 112.4561,
    "lat": 38.8971,
    "fullName": "忻州市",
    "province": "山西"
  },
  "吕梁": {
    "lng": 111.3574,
    "lat": 37.7325,
    "fullName": "吕梁市",
    "province": "山西"
  },
  "临汾": {
    "lng": 111.4783,
    "lat": 36.1615,
    "fullName": "临汾市",
    "province": "山西"
  },
  "晋中": {
    "lng": 112.7747,
    "lat": 37.37,
    "fullName": "晋中市",
    "province": "山西"
  },
  "运城": {
    "lng": 111.1487,
    "lat": 35.2002,
    "fullName": "运城市",
    "province": "山西"
  },
  "大同": {
    "lng": 113.7854,
    "lat": 39.8035,
    "fullName": "大同市",
    "province": "山西"
  },
  "长治": {
    "lng": 112.8625,
    "lat": 36.4746,
    "fullName": "长治市",
    "province": "山西"
  },
  "朔州": {
    "lng": 113.0713,
    "lat": 39.6991,
    "fullName": "朔州市",
    "province": "山西"
  },
  "晋城": {
    "lng": 112.7856,
    "lat": 35.6342,
    "fullName": "晋城市",
    "province": "山西"
  },
  "太原": {
    "lng": 112.3352,
    "lat": 37.9413,
    "fullName": "太原市",
    "province": "山西"
  },
  "阳泉": {
    "lng": 113.4778,
    "lat": 38.0951,
    "fullName": "阳泉市",
    "province": "山西"
  },
  "六安": {
    "lng": 116.3123,
    "lat": 31.8329,
    "fullName": "六安市",
    "province": "安徽"
  },
  "安庆": {
    "lng": 116.7517,
    "lat": 30.5255,
    "fullName": "安庆市",
    "province": "安徽"
  },
  "滁州": {
    "lng": 118.1909,
    "lat": 32.536,
    "fullName": "滁州市",
    "province": "安徽"
  },
  "宣城": {
    "lng": 118.8062,
    "lat": 30.6244,
    "fullName": "宣城市",
    "province": "安徽"
  },
  "阜阳": {
    "lng": 115.7629,
    "lat": 32.9919,
    "fullName": "阜阳市",
    "province": "安徽"
  },
  "宿州": {
    "lng": 117.5208,
    "lat": 33.6841,
    "fullName": "宿州市",
    "province": "安徽"
  },
  "黄山": {
    "lng": 118.0481,
    "lat": 29.9542,
    "fullName": "黄山市",
    "province": "安徽"
  },
  "巢湖": {
    "lng": 117.7734,
    "lat": 31.4978,
    "fullName": "巢湖市",
    "province": "安徽"
  },
  "亳州": {
    "lng": 116.1914,
    "lat": 33.4698,
    "fullName": "亳州市",
    "province": "安徽"
  },
  "池州": {
    "lng": 117.3889,
    "lat": 30.2014,
    "fullName": "池州市",
    "province": "安徽"
  },
  "合肥": {
    "lng": 117.29,
    "lat": 32.0581,
    "fullName": "合肥市",
    "province": "安徽"
  },
  "蚌埠": {
    "lng": 117.4109,
    "lat": 33.1073,
    "fullName": "蚌埠市",
    "province": "安徽"
  },
  "芜湖": {
    "lng": 118.3557,
    "lat": 31.0858,
    "fullName": "芜湖市",
    "province": "安徽"
  },
  "淮北": {
    "lng": 116.6968,
    "lat": 33.6896,
    "fullName": "淮北市",
    "province": "安徽"
  },
  "淮南": {
    "lng": 116.7847,
    "lat": 32.7722,
    "fullName": "淮南市",
    "province": "安徽"
  },
  "马鞍": {
    "lng": 118.6304,
    "lat": 31.5363,
    "fullName": "马鞍山市",
    "province": "安徽"
  },
  "铜陵": {
    "lng": 117.9382,
    "lat": 30.9375,
    "fullName": "铜陵市",
    "province": "安徽"
  },
  "南平": {
    "lng": 118.136,
    "lat": 27.2845,
    "fullName": "南平市",
    "province": "福建"
  },
  "三明": {
    "lng": 117.5317,
    "lat": 26.3013,
    "fullName": "三明市",
    "province": "福建"
  },
  "龙岩": {
    "lng": 116.8066,
    "lat": 25.2026,
    "fullName": "龙岩市",
    "province": "福建"
  },
  "宁德": {
    "lng": 119.6521,
    "lat": 26.9824,
    "fullName": "宁德市",
    "province": "福建"
  },
  "福州": {
    "lng": 119.4543,
    "lat": 25.9222,
    "fullName": "福州市",
    "province": "福建"
  },
  "漳州": {
    "lng": 117.5757,
    "lat": 24.3732,
    "fullName": "漳州市",
    "province": "福建"
  },
  "泉州": {
    "lng": 118.3228,
    "lat": 25.1147,
    "fullName": "泉州市",
    "province": "福建"
  },
  "莆田": {
    "lng": 119.0918,
    "lat": 25.3455,
    "fullName": "莆田市",
    "province": "福建"
  },
  "厦门": {
    "lng": 118.1689,
    "lat": 24.6478,
    "fullName": "厦门市",
    "province": "福建"
  },
  "丽水": {
    "lng": 119.5642,
    "lat": 28.1854,
    "fullName": "丽水市",
    "province": "浙江"
  },
  "杭州": {
    "lng": 119.5313,
    "lat": 29.8773,
    "fullName": "杭州市",
    "province": "浙江"
  },
  "温州": {
    "lng": 120.498,
    "lat": 27.8119,
    "fullName": "温州市",
    "province": "浙江"
  },
  "宁波": {
    "lng": 121.5967,
    "lat": 29.6466,
    "fullName": "宁波市",
    "province": "浙江"
  },
  "舟山": {
    "lng": 122.2559,
    "lat": 30.2234,
    "fullName": "舟山市",
    "province": "浙江"
  },
  "台州": {
    "lng": 121.1353,
    "lat": 28.6688,
    "fullName": "台州市",
    "province": "浙江"
  },
  "金华": {
    "lng": 120.0037,
    "lat": 29.1028,
    "fullName": "金华市",
    "province": "浙江"
  },
  "衢州": {
    "lng": 118.6853,
    "lat": 28.8666,
    "fullName": "衢州市",
    "province": "浙江"
  },
  "绍兴": {
    "lng": 120.564,
    "lat": 29.7565,
    "fullName": "绍兴市",
    "province": "浙江"
  },
  "嘉兴": {
    "lng": 120.9155,
    "lat": 30.6354,
    "fullName": "嘉兴市",
    "province": "浙江"
  },
  "湖州": {
    "lng": 119.8608,
    "lat": 30.7782,
    "fullName": "湖州市",
    "province": "浙江"
  },
  "盐城": {
    "lng": 120.2234,
    "lat": 33.5577,
    "fullName": "盐城市",
    "province": "江苏"
  },
  "徐州": {
    "lng": 117.5208,
    "lat": 34.3268,
    "fullName": "徐州市",
    "province": "江苏"
  },
  "南通": {
    "lng": 121.1023,
    "lat": 32.1625,
    "fullName": "南通市",
    "province": "江苏"
  },
  "淮安": {
    "lng": 118.927,
    "lat": 33.4039,
    "fullName": "淮安市",
    "province": "江苏"
  },
  "苏州": {
    "lng": 120.6519,
    "lat": 31.3989,
    "fullName": "苏州市",
    "province": "江苏"
  },
  "宿迁": {
    "lng": 118.5535,
    "lat": 33.7775,
    "fullName": "宿迁市",
    "province": "江苏"
  },
  "连云": {
    "lng": 119.1248,
    "lat": 34.552,
    "fullName": "连云港市",
    "province": "江苏"
  },
  "扬州": {
    "lng": 119.4653,
    "lat": 32.8162,
    "fullName": "扬州市",
    "province": "江苏"
  },
  "南京": {
    "lng": 118.8062,
    "lat": 31.9208,
    "fullName": "南京市",
    "province": "江苏"
  },
  "泰州": {
    "lng": 120.0586,
    "lat": 32.5525,
    "fullName": "泰州市",
    "province": "江苏"
  },
  "无锡": {
    "lng": 120.3442,
    "lat": 31.5527,
    "fullName": "无锡市",
    "province": "江苏"
  },
  "常州": {
    "lng": 119.4543,
    "lat": 31.5582,
    "fullName": "常州市",
    "province": "江苏"
  },
  "镇江": {
    "lng": 119.4763,
    "lat": 31.9702,
    "fullName": "镇江市",
    "province": "江苏"
  },
  "吴忠": {
    "lng": 106.853,
    "lat": 37.3755,
    "fullName": "吴忠市",
    "province": "宁夏"
  },
  "中卫": {
    "lng": 105.4028,
    "lat": 36.9525,
    "fullName": "中卫市",
    "province": "宁夏"
  },
  "固原": {
    "lng": 106.1389,
    "lat": 35.9363,
    "fullName": "固原市",
    "province": "宁夏"
  },
  "银川": {
    "lng": 106.3586,
    "lat": 38.1775,
    "fullName": "银川市",
    "province": "宁夏"
  },
  "石嘴": {
    "lng": 106.4795,
    "lat": 39.0015,
    "fullName": "石嘴山市",
    "province": "宁夏"
  },
  "儋州": {
    "lng": 109.3291,
    "lat": 19.5653,
    "fullName": "儋州市",
    "province": "海南"
  },
  "文昌": {
    "lng": 110.8905,
    "lat": 19.7823,
    "fullName": "文昌市",
    "province": "海南"
  },
  "乐东": {
    "lng": 109.0283,
    "lat": 18.6301,
    "fullName": "乐东黎族自治县",
    "province": "海南"
  },
  "三亚": {
    "lng": 109.3716,
    "lat": 18.3698,
    "fullName": "三亚市",
    "province": "海南"
  },
  "琼中": {
    "lng": 109.8413,
    "lat": 19.0736,
    "fullName": "琼中黎族苗族自治县",
    "province": "海南"
  },
  "东方": {
    "lng": 108.8498,
    "lat": 19.0414,
    "fullName": "东方市",
    "province": "海南"
  },
  "海口": {
    "lng": 110.3893,
    "lat": 19.8516,
    "fullName": "海口市",
    "province": "海南"
  },
  "万宁": {
    "lng": 110.3137,
    "lat": 18.8388,
    "fullName": "万宁市",
    "province": "海南"
  },
  "澄迈": {
    "lng": 109.9937,
    "lat": 19.7314,
    "fullName": "澄迈县",
    "province": "海南"
  },
  "白沙": {
    "lng": 109.3703,
    "lat": 19.211,
    "fullName": "白沙黎族自治县",
    "province": "海南"
  },
  "琼海": {
    "lng": 110.4208,
    "lat": 19.224,
    "fullName": "琼海市",
    "province": "海南"
  },
  "昌江": {
    "lng": 109.0407,
    "lat": 19.2137,
    "fullName": "昌江黎族自治县",
    "province": "海南"
  },
  "临高": {
    "lng": 109.6957,
    "lat": 19.8063,
    "fullName": "临高县",
    "province": "海南"
  },
  "陵水": {
    "lng": 109.9924,
    "lat": 18.5415,
    "fullName": "陵水黎族自治县",
    "province": "海南"
  },
  "屯昌": {
    "lng": 110.0377,
    "lat": 19.362,
    "fullName": "屯昌县",
    "province": "海南"
  },
  "定安": {
    "lng": 110.3384,
    "lat": 19.4698,
    "fullName": "定安县",
    "province": "海南"
  },
  "保亭": {
    "lng": 109.6284,
    "lat": 18.6108,
    "fullName": "保亭黎族苗族自治县",
    "province": "海南"
  },
  "五指": {
    "lng": 109.5282,
    "lat": 18.8299,
    "fullName": "五指山市",
    "province": "海南"
  }
};

// 外国坐标，先注释
// const worldCountriesMap = {
//   "Moscow": {
//     "lat": "55.7494733",
//     "lng": "37.3523218",
//     "fullName": "莫斯科"
//   },
//   "Petersburg": {
//     "lat": "59.9171483",
//     "lng": "30.0448871",
//     "fullName": "圣彼得堡"
//   },
//   "Vladivostok": {
//     "lat": "43.1736206",
//     "lng": "131.895754",
//     "fullName": "符拉迪沃斯托克(海参崴)"
//   },
//   "Yekaterinburg": {
//     "lat": "56.8138126",
//     "lng": "60.5148523",
//     "fullName": "叶卡捷琳堡"
//   },
//   "Novgorod": {
//     "lat": "56.2926609",
//     "lng": "43.786664",
//     "fullName": "下诺夫哥罗德"
//   },
//   "Novosibirsk": {
//     "lat": "54.969655",
//     "lng": "82.6692313",
//     "fullName": "新西伯利亚"
//   },
//   "Rostov": {
//     "lat": "57.1968001",
//     "lng": "39.3805101",
//     "fullName": "罗斯托夫"
//   },
//   "Uhde": {
//     "lat": "51.8298243",
//     "lng": "107.4760822",
//     "fullName": "乌兰乌德"
//   },
//   "Irkutsk": {
//     "lat": "52.2983044",
//     "lng": "104.1270763",
//     "fullName": "伊尔库茨克"
//   },
//   "Murmansk": {
//     "lat": "68.9673991",
//     "lng": "32.9457132",
//     "fullName": "摩尔曼斯克"
//   },
//   "Sochi": {
//     "lat": "43.6017001",
//     "lng": "39.6550893",
//     "fullName": "索契"
//   },
//   "Volgograd": {
//     "lat": "48.6700797",
//     "lng": "44.22653",
//     "fullName": "伏尔加格勒"
//   },
//   "Kazan": {
//     "lat": "55.7954219",
//     "lng": "48.9332217",
//     "fullName": "喀山"
//   },
//   "RostovOnDon": {
//     "lat": "47.2609231",
//     "lng": "39.4879174",
//     "fullName": "顿河畔罗斯托夫"
//   },
//   "Samara": {
//     "lat": "53.2605796",
//     "lng": "49.9179024",
//     "fullName": "萨马拉"
//   },
//   "Omsk": {
//     "lat": "54.985554",
//     "lng": "73.0759653",
//     "fullName": "鄂木斯克"
//   },
//   "Chelyabinsk": {
//     "lat": "55.1519087",
//     "lng": "61.1283971",
//     "fullName": "车里雅宾斯克"
//   },
//   "Khabarovsk": {
//     "lat": "48.4647596",
//     "lng": "134.9733447",
//     "fullName": "伯力"
//   },
//   "Pyatigorsk": {
//     "lat": "44.0433504",
//     "lng": "42.9705613",
//     "fullName": "皮亚季戈尔斯克"
//   },
//   "Ufa": {
//     "lat": "54.8086988",
//     "lng": "55.8807921",
//     "fullName": "乌法"
//   },
//   "Perm": {
//     "lat": "58.0201783",
//     "lng": "55.9541039",
//     "fullName": "彼尔姆"
//   },
//   "Krasnoyarsk": {
//     "lat": "56.0266501",
//     "lng": "92.7256527",
//     "fullName": "克拉斯诺亚尔斯克"
//   },
//   "Voronezh": {
//     "lat": "51.6753557",
//     "lng": "38.9559888",
//     "fullName": "沃罗涅日"
//   },
//   "Saratov": {
//     "lat": "51.5341886",
//     "lng": "45.8700586",
//     "fullName": "萨拉托夫"
//   },
//   "Krasnodar": {
//     "lat": "45.0535266",
//     "lng": "38.9460163",
//     "fullName": "克拉斯诺达尔"
//   },
//   "Tolyatti": {
//     "lat": "53.5218291",
//     "lng": "49.2950109",
//     "fullName": "陶里亚蒂"
//   },
//   "Izevsk": {
//     "lat": "56.8637312",
//     "lng": "53.0880195",
//     "fullName": "伊热夫斯克"
//   },
//   "Ulyanovsk": {
//     "lat": "54.3110964",
//     "lng": "48.326138",
//     "fullName": "乌里扬诺夫斯克"
//   },
//   "Barnaul": {
//     "lat": "53.3332194",
//     "lng": "83.5971963",
//     "fullName": "巴尔瑙尔"
//   },
//   "Yaroslavl": {
//     "lat": "57.6523811",
//     "lng": "39.7244361",
//     "fullName": "雅罗斯拉夫尔"
//   },
//
//   "Brasilia": {
//     "lat": "-15.7217175",
//     "lng": "-48.0783217",
//     "fullName": "巴西利亚"
//   },
//   "Paulo": {
//     "lat": "-23.6821604",
//     "lng": "-46.8754884",
//     "fullName": "圣保罗"
//   },
//   "Iguazul": {
//     "lat": "-25.46543",
//     "lng": "-54.5972328",
//     "fullName": "伊瓜苏市"
//   },
//   "Janeiro": {
//     "lat": "-22.9109878",
//     "lng": "-43.7285235",
//     "fullName": "里约热内卢"
//   },
//   "Horizonte": {
//     "lat": "-19.9178164",
//     "lng": "-44.100397",
//     "fullName": "贝洛奥里藏特"
//   },
//   "Manaus": {
//     "lat": "-2.573136",
//     "lng": "-60.5418579",
//     "fullName": "玛瑙斯市"
//   },
//   "Salvador": {
//     "lat": "-12.8808976",
//     "lng": "-38.557671",
//     "fullName": "萨尔瓦多"
//   },
//   "Recife": {
//     "lat": "-8.0464433",
//     "lng": "-35.0025286",
//     "fullName": "累西腓"
//   },
//   "Alegre": {
//     "lat": "-30.1007488",
//     "lng": "-51.2990333",
//     "fullName": "阿雷格里港"
//   },
//   "Goiania": {
//     "lat": "-16.6427714",
//     "lng": "-49.4025521",
//     "fullName": "戈亚尼亚"
//   },
//   "Curitiba": {
//     "lat": "-25.4950853",
//     "lng": "-49.4274875",
//     "fullName": "库里蒂巴"
//   },
//
//   "Istanbul": {
//     "lat": "41.0049823",
//     "lng": "28.7319977",
//     "fullName": "伊斯坦布尔"
//   },
//   "Ankara": {
//     "lat": "39.9032923",
//     "lng": "32.6226813",
//     "fullName": "安卡拉"
//   },
//   "Izmir": {
//     "lat": "38.4175917",
//     "lng": "26.9396782",
//     "fullName": "伊兹密尔"
//   },
//   "Bursa": {
//     "lat": "40.2215936",
//     "lng": "28.8922061",
//     "fullName": "布尔萨"
//   },
//   "Adana": {
//     "lat": "36.9973327",
//     "lng": "35.1479832",
//     "fullName": "阿达纳"
//   },
//   "Gaziantep": {
//     "lat": "37.0587663",
//     "lng": "37.3451175",
//     "fullName": "加济安泰普"
//   },
//   "Konya": {
//     "lat": "37.8784235",
//     "lng": "32.3663988",
//     "fullName": "科尼亚"
//   },
//   "Antalya": {
//     "lat": "36.897917",
//     "lng": "30.6480652",
//     "fullName": "安塔利亚"
//   },
//   "Kayserispor": {
//     "lat": "38.7233801",
//     "lng": "35.4001473",
//     "fullName": "开塞利"
//   },
//   "Samsun": {
//     "lat": "41.291388",
//     "lng": "36.2436588",
//     "fullName": "萨姆松"
//   },
//
//   "Madrid": {
//     "lat": "40.4378698",
//     "lng": "-3.81962",
//     "fullName": "马德里"
//   },
//   "Barcelona": {
//     "lat": "41.3947688",
//     "lng": "2.0787281",
//     "fullName": "巴塞罗那"
//   },
//   "Valencia": {
//     "lat": "39.468913",
//     "lng": "-0.4364238",
//     "fullName": "巴伦西亚"
//   },
//   "Sevilla": {
//     "lat": "37.3753501",
//     "lng": "-6.0250981",
//     "fullName": "塞维利亚"
//   },
//   "Cordoba": {
//     "lat": "37.8915808",
//     "lng": "-4.8195047",
//     "fullName": "科尔多瓦"
//   },
//
//   "NewYork": {
//     "lat": "40.7029741",
//     "lng": "-74.2598629",
//     "fullName": "纽约"
//   },
//   "LosAngeles": {
//     "lat": "34.0201812",
//     "lng": "-118.6919177",
//     "fullName": "洛杉矶"
//   },
//   "Chicago": {
//     "lat": "41.8336478",
//     "lng": "-87.8722387",
//     "fullName": "芝加哥"
//   },
//   "Houston": {
//     "lat": "29.8168824",
//     "lng": "-95.6814784",
//     "fullName": "休斯敦"
//   },
//   "Philadelphia": {
//     "lat": "40.0046684",
//     "lng": "-75.2581164",
//     "fullName": "费城"
//   },
//   "Phoenix": {
//     "lat": "33.6050991",
//     "lng": "-112.4052364",
//     "fullName": "菲尼克斯(凤凰城)"
//   },
//   "SanDiego": {
//     "lat": "32.8242404",
//     "lng": "-117.375349",
//     "fullName": "圣地亚哥"
//   },
//   "Dallas": {
//     "lat": "32.8205865",
//     "lng": "-96.8714239",
//     "fullName": "达拉斯"
//   },
//   "SanAntonio": {
//     "lat": "29.481137",
//     "lng": "-98.7945916",
//     "fullName": "圣安东尼奥"
//   },
//   "Detroit": {
//     "lat": "42.3526257",
//     "lng": "-83.2392882",
//     "fullName": "底特律"
//   },
//   "Indianapolis": {
//     "lat": "39.7797003",
//     "lng": "-86.2728335",
//     "fullName": "印第安纳波利斯"
//   },
//   "SanFrancisco": {
//     "lat": "37.7576793",
//     "lng": "-122.5076399",
//     "fullName": "旧金山"
//   },
//   "Columbus": {
//     "lat": "39.9828671",
//     "lng": "-83.1309125",
//     "fullName": "哥伦布"
//   },
//   "Austin": {
//     "lat": "30.3076863",
//     "lng": "-97.8934859",
//     "fullName": "奥斯汀"
//   },
//   "Baltimore": {
//     "lat": "39.2846854",
//     "lng": "-76.6905258",
//     "fullName": "巴尔的摩"
//   },
//   "Milwaukee": {
//     "lat": "43.057806",
//     "lng": "-88.1075131",
//     "fullName": "密尔沃基"
//   },
//   "Boston": {
//     "lat": "42.3133521",
//     "lng": "-71.1271968",
//     "fullName": "波士顿"
//   },
//   "Washington": {
//     "lat": "38.8993278",
//     "lng": "-77.0846063",
//     "fullName": "华盛顿"
//   },
//   "Seattle": {
//     "lat": "47.6147628",
//     "lng": "-122.4759883",
//     "fullName": "西雅图"
//   },
//   "Atlanta": {
//     "lat": "33.7676338",
//     "lng": "-84.5606881",
//     "fullName": "亚特兰大"
//   },
//   "SanJose": {
//     "lat": "37.296933",
//     "lng": "-121.9574947",
//     "fullName": "圣荷西"
//   },
//   "Jacksonville": {
//     "lat": "30.3446913",
//     "lng": "-82.0006437",
//     "fullName": "杰克逊维尔"
//   },
//   "Memphis": {
//     "lat": "35.1288636",
//     "lng": "-90.2509716",
//     "fullName": "孟菲斯"
//   },
//   "Charlotte": {
//     "lat": "35.2030728",
//     "lng": "-80.97961",
//     "fullName": "夏洛特"
//   },
//   "FortWorth": {
//     "lat": "32.800501",
//     "lng": "-97.5695047",
//     "fullName": "沃思堡"
//   },
//
//
//   "BD": {
//     "lat": "24",
//     "lng": "90",
//     "fullName": "BANGLADESH"
//   },
//   "BE": {
//     "lat": "50.8333",
//     "lng": "4",
//     "fullName": "BELGIUM"
//   },
//   "BF": {
//     "lat": "13",
//     "lng": "-2",
//     "fullName": "BURKINA FASO"
//   },
//   "BG": {
//     "lat": "43",
//     "lng": "25",
//     "fullName": "BULGARIA"
//   },
//   "BA": {
//     "lat": "44",
//     "lng": "18",
//     "fullName": "BOSNIA AND HERZEGOVINA"
//   },
//   "BB": {
//     "lat": "13.1667",
//     "lng": "-59.5333",
//     "fullName": "BARBADOS"
//   },
//   "WF": {
//     "lat": "-13.3",
//     "lng": "-176.2",
//     "fullName": "WALLIS AND FUTUNA"
//   },
//   "BM": {
//     "lat": "32.3333",
//     "lng": "-64.75",
//     "fullName": "BERMUDA"
//   },
//   "BN": {
//     "lat": "4.5",
//     "lng": "114.6667",
//     "fullName": "BRUNEI DARUSSALAM"
//   },
//   "BO": {
//     "lat": "-17",
//     "lng": "-65",
//     "fullName": "BOLIVIA, PLURINATIONAL STATE OF"
//   },
//   "BH": {
//     "lat": "26",
//     "lng": "50.55",
//     "fullName": "BAHRAIN"
//   },
//   "BI": {
//     "lat": "-3.5",
//     "lng": "30",
//     "fullName": "BURUNDI"
//   },
//   "BJ": {
//     "lat": "9.5",
//     "lng": "2.25",
//     "fullName": "BENIN"
//   },
//   "BT": {
//     "lat": "27.5",
//     "lng": "90.5",
//     "fullName": "BHUTAN"
//   },
//   "JM": {
//     "lat": "18.25",
//     "lng": "-77.5",
//     "fullName": "JAMAICA"
//   },
//   "BV": {
//     "lat": "-54.4333",
//     "lng": "3.4",
//     "fullName": "BOUVET ISLAND"
//   },
//   "BW": {
//     "lat": "-22",
//     "lng": "24",
//     "fullName": "BOTSWANA"
//   },
//   "WS": {
//     "lat": "-13.5833",
//     "lng": "-172.3333",
//     "fullName": "SAMOA"
//   },
//   "BR": {
//     "lat": "-10",
//     "lng": "-55",
//     "fullName": "BRAZIL"
//   },
//   "BS": {
//     "lat": "24.25",
//     "lng": "-76",
//     "fullName": "BAHAMAS"
//   },
//   "JE": {
//     "lat": "49.21",
//     "lng": "-2.13",
//     "fullName": "JERSEY"
//   },
//   "BY": {
//     "lat": "53",
//     "lng": "28",
//     "fullName": "BELARUS"
//   },
//   "BZ": {
//     "lat": "17.25",
//     "lng": "-88.75",
//     "fullName": "BELIZE"
//   },
//   "RU": {
//     "lat": "60",
//     "lng": "100",
//     "fullName": "RUSSIAN FEDERATION"
//   },
//   "RW": {
//     "lat": "-2",
//     "lng": "30",
//     "fullName": "RWANDA"
//   },
//   "RS": {
//     "lat": "44",
//     "lng": "21",
//     "fullName": "SERBIA"
//   },
//   "TL": {
//     "lat": "-8.55",
//     "lng": "125.5167",
//     "fullName": "TIMOR-LESTE"
//   },
//   "RE": {
//     "lat": "-21.1",
//     "lng": "55.6",
//     "fullName": "RÉUNION"
//   },
//   "TM": {
//     "lat": "40",
//     "lng": "60",
//     "fullName": "TURKMENISTAN"
//   },
//   "TJ": {
//     "lat": "39",
//     "lng": "71",
//     "fullName": "TAJIKISTAN"
//   },
//   "RO": {
//     "lat": "46",
//     "lng": "25",
//     "fullName": "ROMANIA"
//   },
//   "TK": {
//     "lat": "-9",
//     "lng": "-172",
//     "fullName": "TOKELAU"
//   },
//   "GW": {
//     "lat": "12",
//     "lng": "-15",
//     "fullName": "GUINEA-BISSAU"
//   },
//   "GU": {
//     "lat": "13.4667",
//     "lng": "144.7833",
//     "fullName": "GUAM"
//   },
//   "GT": {
//     "lat": "15.5",
//     "lng": "-90.25",
//     "fullName": "GUATEMALA"
//   },
//   "GS": {
//     "lat": "-54.5",
//     "lng": "-37",
//     "fullName": "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS"
//   },
//   "GR": {
//     "lat": "39",
//     "lng": "22",
//     "fullName": "GREECE"
//   },
//   "GQ": {
//     "lat": "2",
//     "lng": "10",
//     "fullName": "EQUATORIAL GUINEA"
//   },
//   "GP": {
//     "lat": "16.25",
//     "lng": "-61.5833",
//     "fullName": "GUADELOUPE"
//   },
//   "JP": {
//     "lat": "36",
//     "lng": "138",
//     "fullName": "JAPAN"
//   },
//   "GY": {
//     "lat": "5",
//     "lng": "-59",
//     "fullName": "GUYANA"
//   },
//   "GG": {
//     "lat": "49.5",
//     "lng": "-2.56",
//     "fullName": "GUERNSEY"
//   },
//   "GF": {
//     "lat": "4",
//     "lng": "-53",
//     "fullName": "FRENCH GUIANA"
//   },
//   "GE": {
//     "lat": "42",
//     "lng": "43.5",
//     "fullName": "GEORGIA"
//   },
//   "GD": {
//     "lat": "12.1167",
//     "lng": "-61.6667",
//     "fullName": "GRENADA"
//   },
//   "GB": {
//     "lat": "54",
//     "lng": "-2",
//     "fullName": "UNITED KINGDOM"
//   },
//   "GA": {
//     "lat": "-1",
//     "lng": "11.75",
//     "fullName": "GABON"
//   },
//   "GN": {
//     "lat": "11",
//     "lng": "-10",
//     "fullName": "GUINEA"
//   },
//   "GM": {
//     "lat": "13.4667",
//     "lng": "-16.5667",
//     "fullName": "GAMBIA"
//   },
//   "GL": {
//     "lat": "72",
//     "lng": "-40",
//     "fullName": "GREENLAND"
//   },
//   "GI": {
//     "lat": "36.1833",
//     "lng": "-5.3667",
//     "fullName": "GIBRALTAR"
//   },
//   "GH": {
//     "lat": "8",
//     "lng": "-2",
//     "fullName": "GHANA"
//   },
//   "OM": {
//     "lat": "21",
//     "lng": "57",
//     "fullName": "OMAN"
//   },
//   "TN": {
//     "lat": "34",
//     "lng": "9",
//     "fullName": "TUNISIA"
//   },
//   "JO": {
//     "lat": "31",
//     "lng": "36",
//     "fullName": "JORDAN"
//   },
//   "HR": {
//     "lat": "45.1667",
//     "lng": "15.5",
//     "fullName": "CROATIA"
//   },
//   "HT": {
//     "lat": "19",
//     "lng": "-72.4167",
//     "fullName": "HAITI"
//   },
//   "HU": {
//     "lat": "47",
//     "lng": "20",
//     "fullName": "HUNGARY"
//   },
//   "HK": {
//     "lat": "22.25",
//     "lng": "114.1667",
//     "fullName": "HONG KONG"
//   },
//   "HN": {
//     "lat": "15",
//     "lng": "-86.5",
//     "fullName": "HONDURAS"
//   },
//   "HM": {
//     "lat": "-53.1",
//     "lng": "72.5167",
//     "fullName": "HEARD ISLAND AND MCDONALD ISLANDS"
//   },
//   "VE": {
//     "lat": "8",
//     "lng": "-66",
//     "fullName": "VENEZUELA, BOLIVARIAN REPUBLIC OF"
//   },
//   "PR": {
//     "lat": "18.25",
//     "lng": "-66.5",
//     "fullName": "PUERTO RICO"
//   },
//   "PS": {
//     "lat": "32",
//     "lng": "35.25",
//     "fullName": "PALESTINIAN TERRITORY, OCCUPIED"
//   },
//   "PW": {
//     "lat": "7.5",
//     "lng": "134.5",
//     "fullName": "PALAU"
//   },
//   "PT": {
//     "lat": "39.5",
//     "lng": "-8",
//     "fullName": "PORTUGAL"
//   },
//   "KN": {
//     "lat": "17.3333",
//     "lng": "-62.75",
//     "fullName": "SAINT KITTS AND NEVIS"
//   },
//   "PY": {
//     "lat": "-23",
//     "lng": "-58",
//     "fullName": "PARAGUAY"
//   },
//   "IQ": {
//     "lat": "33",
//     "lng": "44",
//     "fullName": "IRAQ"
//   },
//   "PA": {
//     "lat": "9",
//     "lng": "-80",
//     "fullName": "PANAMA"
//   },
//   "PF": {
//     "lat": "-15",
//     "lng": "-140",
//     "fullName": "FRENCH POLYNESIA"
//   },
//   "PG": {
//     "lat": "-6",
//     "lng": "147",
//     "fullName": "PAPUA NEW GUINEA"
//   },
//   "PE": {
//     "lat": "-10",
//     "lng": "-76",
//     "fullName": "PERU"
//   },
//   "PK": {
//     "lat": "30",
//     "lng": "70",
//     "fullName": "PAKISTAN"
//   },
//   "PH": {
//     "lat": "13",
//     "lng": "122",
//     "fullName": "PHILIPPINES"
//   },
//   "PN": {
//     "lat": "-24.7",
//     "lng": "-127.4",
//     "fullName": "PITCAIRN"
//   },
//   "PL": {
//     "lat": "52",
//     "lng": "20",
//     "fullName": "POLAND"
//   },
//   "PM": {
//     "lat": "46.8333",
//     "lng": "-56.3333",
//     "fullName": "SAINT PIERRE AND MIQUElng"
//   },
//   "ZM": {
//     "lat": "-15",
//     "lng": "30",
//     "fullName": "ZAMBIA"
//   },
//   "EH": {
//     "lat": "24.5",
//     "lng": "-13",
//     "fullName": "WESTERN SAHARA"
//   },
//   "EE": {
//     "lat": "59",
//     "lng": "26",
//     "fullName": "ESTONIA"
//   },
//   "EG": {
//     "lat": "27",
//     "lng": "30",
//     "fullName": "EGYPT"
//   },
//   "ZA": {
//     "lat": "-29",
//     "lng": "24",
//     "fullName": "SOUTH AFRICA"
//   },
//   "EC": {
//     "lat": "-2",
//     "lng": "-77.5",
//     "fullName": "ECUADOR"
//   },
//   "IT": {
//     "lat": "42.8333",
//     "lng": "12.8333",
//     "fullName": "ITALY"
//   },
//   "VN": {
//     "lat": "16",
//     "lng": "106",
//     "fullName": "VIET NAM"
//   },
//   "SB": {
//     "lat": "-8",
//     "lng": "159",
//     "fullName": "SOLOMON ISLANDS"
//   },
//   "ET": {
//     "lat": "8",
//     "lng": "38",
//     "fullName": "ETHIOPIA"
//   },
//   "SO": {
//     "lat": "10",
//     "lng": "49",
//     "fullName": "SOMALIA"
//   },
//   "ZW": {
//     "lat": "-20",
//     "lng": "30",
//     "fullName": "ZIMBABWE"
//   },
//   "SA": {
//     "lat": "25",
//     "lng": "45",
//     "fullName": "SAUDI ARABIA"
//   },
//   "ES": {
//     "lat": "40",
//     "lng": "-4",
//     "fullName": "SPAIN"
//   },
//   "ER": {
//     "lat": "15",
//     "lng": "39",
//     "fullName": "ERITREA"
//   },
//   "ME": {
//     "lat": "42",
//     "lng": "19",
//     "fullName": "MONTENEGRO"
//   },
//   "MD": {
//     "lat": "47",
//     "lng": "29",
//     "fullName": "MOLDOVA, REPUBLIC OF"
//   },
//   "MG": {
//     "lat": "-20",
//     "lng": "47",
//     "fullName": "MADAGASCAR"
//   },
//   "MA": {
//     "lat": "32",
//     "lng": "-5",
//     "fullName": "MOROCCO"
//   },
//   "MC": {
//     "lat": "43.7333",
//     "lng": "7.4",
//     "fullName": "MONACO"
//   },
//   "UZ": {
//     "lat": "41",
//     "lng": "64",
//     "fullName": "UZBEKISTAN"
//   },
//   "MM": {
//     "lat": "22",
//     "lng": "98",
//     "fullName": "MYANMAR"
//   },
//   "ML": {
//     "lat": "17",
//     "lng": "-4",
//     "fullName": "MALI"
//   },
//   "MO": {
//     "lat": "22.1667",
//     "lng": "113.55",
//     "fullName": "MACAO"
//   },
//   "MN": {
//     "lat": "46",
//     "lng": "105",
//     "fullName": "MONGOLIA"
//   },
//   "MH": {
//     "lat": "9",
//     "lng": "168",
//     "fullName": "MARSHALL ISLANDS"
//   },
//   "MK": {
//     "lat": "41.8333",
//     "lng": "22",
//     "fullName": "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF"
//   },
//   "MU": {
//     "lat": "-20.2833",
//     "lng": "57.55",
//     "fullName": "MAURITIUS"
//   },
//   "MT": {
//     "lat": "35.8333",
//     "lng": "14.5833",
//     "fullName": "MALTA"
//   },
//   "MW": {
//     "lat": "-13.5",
//     "lng": "34",
//     "fullName": "MALAWI"
//   },
//   "MV": {
//     "lat": "3.25",
//     "lng": "73",
//     "fullName": "MALDIVES"
//   },
//   "MQ": {
//     "lat": "14.6667",
//     "lng": "-61",
//     "fullName": "MARTINIQUE"
//   },
//   "MP": {
//     "lat": "15.2",
//     "lng": "145.75",
//     "fullName": "NORTHERN MARIANA ISLANDS"
//   },
//   "MS": {
//     "lat": "16.75",
//     "lng": "-62.2",
//     "fullName": "MONTSERRAT"
//   },
//   "MR": {
//     "lat": "20",
//     "lng": "-12",
//     "fullName": "MAURITANIA"
//   },
//   "IM": {
//     "lat": "54.23",
//     "lng": "-4.55",
//     "fullName": "ISLE OF MAN"
//   },
//   "UG": {
//     "lat": "1",
//     "lng": "32",
//     "fullName": "UGANDA"
//   },
//   "MY": {
//     "lat": "2.5",
//     "lng": "112.5",
//     "fullName": "MALAYSIA"
//   },
//   "MX": {
//     "lat": "23",
//     "lng": "-102",
//     "fullName": "MEXICO"
//   },
//   "IL": {
//     "lat": "31.5",
//     "lng": "34.75",
//     "fullName": "ISRAEL"
//   },
//   "FR": {
//     "lat": "46",
//     "lng": "2",
//     "fullName": "FRANCE"
//   },
//   "AW": {
//     "lat": "12.5",
//     "lng": "-69.9667",
//     "fullName": "ARUBA"
//   },
//   "SH": {
//     "lat": "-15.9333",
//     "lng": "-5.7",
//     "fullName": "SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA"
//   },
//   "SJ": {
//     "lat": "78",
//     "lng": "20",
//     "fullName": "SVALBARD AND JAN MAYEN"
//   },
//   "FI": {
//     "lat": "64",
//     "lng": "26",
//     "fullName": "FINLAND"
//   },
//   "FJ": {
//     "lat": "-18",
//     "lng": "175",
//     "fullName": "FIJI"
//   },
//   "FK": {
//     "lat": "-51.75",
//     "lng": "-59",
//     "fullName": "FALKLAND ISLANDS (MALVINAS)"
//   },
//   "FM": {
//     "lat": "6.9167",
//     "lng": "158.25",
//     "fullName": "MICRONESIA, FEDERATED STATES OF"
//   },
//   "FO": {
//     "lat": "62",
//     "lng": "-7",
//     "fullName": "FAROE ISLANDS"
//   },
//   "NI": {
//     "lat": "13",
//     "lng": "-85",
//     "fullName": "NICARAGUA"
//   },
//   "NL": {
//     "lat": "52.5",
//     "lng": "5.75",
//     "fullName": "NETHERLANDS"
//   },
//   "NO": {
//     "lat": "62",
//     "lng": "10",
//     "fullName": "NORWAY"
//   },
//   "NA": {
//     "lat": "-22",
//     "lng": "17",
//     "fullName": "NAMIBIA"
//   },
//   "VU": {
//     "lat": "-16",
//     "lng": "167",
//     "fullName": "VANUATU"
//   },
//   "NC": {
//     "lat": "-21.5",
//     "lng": "165.5",
//     "fullName": "NEW CALEDONIA"
//   },
//   "NE": {
//     "lat": "16",
//     "lng": "8",
//     "fullName": "NIGER"
//   },
//   "NF": {
//     "lat": "-29.0333",
//     "lng": "167.95",
//     "fullName": "NORFOLK ISLAND"
//   },
//   "NG": {
//     "lat": "10",
//     "lng": "8",
//     "fullName": "NIGERIA"
//   },
//   "NZ": {
//     "lat": "-41",
//     "lng": "174",
//     "fullName": "NEW ZEALAND"
//   },
//   "NP": {
//     "lat": "28",
//     "lng": "84",
//     "fullName": "NEPAL"
//   },
//   "NR": {
//     "lat": "-0.5333",
//     "lng": "166.9167",
//     "fullName": "NAURU"
//   },
//   "NU": {
//     "lat": "-19.0333",
//     "lng": "-169.8667",
//     "fullName": "NIUE"
//   },
//   "CK": {
//     "lat": "-21.2333",
//     "lng": "-159.7667",
//     "fullName": "COOK ISLANDS"
//   },
//   "CI": {
//     "lat": "8",
//     "lng": "-5",
//     "fullName": "CÔTE D'IVOIRE"
//   },
//   "CH": {
//     "lat": "47",
//     "lng": "8",
//     "fullName": "SWITZERLAND"
//   },
//   "CO": {
//     "lat": "4",
//     "lng": "-72",
//     "fullName": "COLOMBIA"
//   },
//   "CN": {
//     "lat": "35",
//     "lng": "105",
//     "fullName": "CHINA"
//   },
//   "CM": {
//     "lat": "6",
//     "lng": "12",
//     "fullName": "CAMEROON"
//   },
//   "CL": {
//     "lat": "-30",
//     "lng": "-71",
//     "fullName": "CHILE"
//   },
//   "CC": {
//     "lat": "-12.5",
//     "lng": "96.8333",
//     "fullName": "COCOS (KEELING) ISLANDS"
//   },
//   "CA": {
//     "lat": "60",
//     "lng": "-95",
//     "fullName": "CANADA"
//   },
//   "CG": {
//     "lat": "-1",
//     "lng": "15",
//     "fullName": "CONGO"
//   },
//   "CF": {
//     "lat": "7",
//     "lng": "21",
//     "fullName": "CENTRAL AFRICAN REPUBLIC"
//   },
//   "CD": {
//     "lat": "0",
//     "lng": "25",
//     "fullName": "CONGO, THE DEMOCRATIC REPUBLIC OF THE"
//   },
//   "CZ": {
//     "lat": "49.75",
//     "lng": "15.5",
//     "fullName": "CZECH REPUBLIC"
//   },
//   "CY": {
//     "lat": "35",
//     "lng": "33",
//     "fullName": "CYPRUS"
//   },
//   "CX": {
//     "lat": "-10.5",
//     "lng": "105.6667",
//     "fullName": "CHRISTMAS ISLAND"
//   },
//   "CR": {
//     "lat": "10",
//     "lng": "-84",
//     "fullName": "COSTA RICA"
//   },
//   "CV": {
//     "lat": "16",
//     "lng": "-24",
//     "fullName": "CAPE VERDE"
//   },
//   "CU": {
//     "lat": "21.5",
//     "lng": "-80",
//     "fullName": "CUBA"
//   },
//   "SZ": {
//     "lat": "-26.5",
//     "lng": "31.5",
//     "fullName": "SWAZILAND"
//   },
//   "SY": {
//     "lat": "35",
//     "lng": "38",
//     "fullName": "SYRIAN ARAB REPUBLIC"
//   },
//   "KG": {
//     "lat": "41",
//     "lng": "75",
//     "fullName": "KYRGYZSTAN"
//   },
//   "KE": {
//     "lat": "1",
//     "lng": "38",
//     "fullName": "KENYA"
//   },
//   "SR": {
//     "lat": "4",
//     "lng": "-56",
//     "fullName": "SURINAME"
//   },
//   "KI": {
//     "lat": "1.4167",
//     "lng": "173",
//     "fullName": "KIRIBATI"
//   },
//   "KH": {
//     "lat": "13",
//     "lng": "105",
//     "fullName": "CAMBODIA"
//   },
//   "SV": {
//     "lat": "13.8333",
//     "lng": "-88.9167",
//     "fullName": "EL SALVADOR"
//   },
//   "KM": {
//     "lat": "-12.1667",
//     "lng": "44.25",
//     "fullName": "COMOROS"
//   },
//   "ST": {
//     "lat": "1",
//     "lng": "7",
//     "fullName": "SAO TOME AND PRINCIPE"
//   },
//   "SK": {
//     "lat": "48.6667",
//     "lng": "19.5",
//     "fullName": "SLOVAKIA"
//   },
//   "KR": {
//     "lat": "37",
//     "lng": "127.5",
//     "fullName": "KOREA, REPUBLIC OF"
//   },
//   "SI": {
//     "lat": "46",
//     "lng": "15",
//     "fullName": "SLOVENIA"
//   },
//   "KP": {
//     "lat": "40",
//     "lng": "127",
//     "fullName": "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF"
//   },
//   "KW": {
//     "lat": "29.3375",
//     "lng": "47.6581",
//     "fullName": "KUWAIT"
//   },
//   "SN": {
//     "lat": "14",
//     "lng": "-14",
//     "fullName": "SENEGAL"
//   },
//   "SM": {
//     "lat": "43.7667",
//     "lng": "12.4167",
//     "fullName": "SAN MARINO"
//   },
//   "SL": {
//     "lat": "8.5",
//     "lng": "-11.5",
//     "fullName": "SIERRA LEONE"
//   },
//   "SC": {
//     "lat": "-4.5833",
//     "lng": "55.6667",
//     "fullName": "SEYCHELLES"
//   },
//   "KZ": {
//     "lat": "48",
//     "lng": "68",
//     "fullName": "KAZAKHSTAN"
//   },
//   "KY": {
//     "lat": "19.5",
//     "lng": "-80.5",
//     "fullName": "CAYMAN ISLANDS"
//   },
//   "SG": {
//     "lat": "1.3667",
//     "lng": "103.8",
//     "fullName": "SINGAPORE"
//   },
//   "SE": {
//     "lat": "62",
//     "lng": "15",
//     "fullName": "SWEDEN"
//   },
//   "SD": {
//     "lat": "15",
//     "lng": "30",
//     "fullName": "SUDAN"
//   },
//   "DO": {
//     "lat": "19",
//     "lng": "-70.6667",
//     "fullName": "DOMINICAN REPUBLIC"
//   },
//   "DM": {
//     "lat": "15.4167",
//     "lng": "-61.3333",
//     "fullName": "DOMINICA"
//   },
//   "DJ": {
//     "lat": "11.5",
//     "lng": "43",
//     "fullName": "DJIBOUTI"
//   },
//   "DK": {
//     "lat": "56",
//     "lng": "10",
//     "fullName": "DENMARK"
//   },
//   "VG": {
//     "lat": "18.5",
//     "lng": "-64.5",
//     "fullName": "VIRGIN ISLANDS, BRITISH"
//   },
//   "DE": {
//     "lat": "51",
//     "lng": "9",
//     "fullName": "GERMANY"
//   },
//   "YE": {
//     "lat": "15",
//     "lng": "48",
//     "fullName": "YEMEN"
//   },
//   "DZ": {
//     "lat": "28",
//     "lng": "3",
//     "fullName": "ALGERIA"
//   },
//   "US": {
//     "lat": "38",
//     "lng": "-97",
//     "fullName": "UNITED STATES"
//   },
//   "US1": {
//     "lat": "45",
//     "lng": "-108",
//     "fullName": "UNITED STATES 1"
//   },
//   "US2": {
//     "lat": "36",
//     "lng": "-102",
//     "fullName": "UNITED STATES 2"
//   },
//   "UY": {
//     "lat": "-33",
//     "lng": "-56",
//     "fullName": "URUGUAY"
//   },
//   "YT": {
//     "lat": "-12.8333",
//     "lng": "45.1667",
//     "fullName": "MAYOTTE"
//   },
//   "UM": {
//     "lat": "19.2833",
//     "lng": "166.6",
//     "fullName": "UNITED STATES MINOR OUTLYING ISLANDS"
//   },
//   "LB": {
//     "lat": "33.8333",
//     "lng": "35.8333",
//     "fullName": "LEBANON"
//   },
//   "LC": {
//     "lat": "13.8833",
//     "lng": "-61.1333",
//     "fullName": "SAINT LUCIA"
//   },
//   "LA": {
//     "lat": "18",
//     "lng": "105",
//     "fullName": "LAO PEOPLE'S DEMOCRATIC REPUBLIC"
//   },
//   "TV": {
//     "lat": "-8",
//     "lng": "178",
//     "fullName": "TUVALU"
//   },
//   "TT": {
//     "lat": "11",
//     "lng": "-61",
//     "fullName": "TRINIDAD AND TOBAGO"
//   },
//   "TR": {
//     "lat": "39",
//     "lng": "35",
//     "fullName": "TURKEY"
//   },
//   "LK": {
//     "lat": "7",
//     "lng": "81",
//     "fullName": "SRI LANKA"
//   },
//   "LI": {
//     "lat": "47.1667",
//     "lng": "9.5333",
//     "fullName": "LIECHTENSTEIN"
//   },
//   "LV": {
//     "lat": "57",
//     "lng": "25",
//     "fullName": "LATVIA"
//   },
//   "TO": {
//     "lat": "-20",
//     "lng": "-175",
//     "fullName": "TONGA"
//   },
//   "LT": {
//     "lat": "56",
//     "lng": "24",
//     "fullName": "LITHUANIA"
//   },
//   "LU": {
//     "lat": "49.75",
//     "lng": "6.1667",
//     "fullName": "LUXEMBOURG"
//   },
//   "LR": {
//     "lat": "6.5",
//     "lng": "-9.5",
//     "fullName": "LIBERIA"
//   },
//   "LS": {
//     "lat": "-29.5",
//     "lng": "28.5",
//     "fullName": "LESOTHO"
//   },
//   "TH": {
//     "lat": "15",
//     "lng": "100",
//     "fullName": "THAILAND"
//   },
//   "TF": {
//     "lat": "-43",
//     "lng": "67",
//     "fullName": "FRENCH SOUTHERN TERRITORIES"
//   },
//   "TG": {
//     "lat": "8",
//     "lng": "1.1667",
//     "fullName": "TOGO"
//   },
//   "TD": {
//     "lat": "15",
//     "lng": "19",
//     "fullName": "CHAD"
//   },
//   "TC": {
//     "lat": "21.75",
//     "lng": "-71.5833",
//     "fullName": "TURKS AND CAICOS ISLANDS"
//   },
//   "LY": {
//     "lat": "25",
//     "lng": "17",
//     "fullName": "LIBYA"
//   },
//   "VA": {
//     "lat": "41.9",
//     "lng": "12.45",
//     "fullName": "HOLY SEE (VATICAN CITY STATE)"
//   },
//   "VC": {
//     "lat": "13.25",
//     "lng": "-61.2",
//     "fullName": "SAINT VINCENT AND THE GRENADINES"
//   },
//   "AE": {
//     "lat": "24",
//     "lng": "54",
//     "fullName": "UNITED ARAB EMIRATES"
//   },
//   "AD": {
//     "lat": "42.5",
//     "lng": "1.6",
//     "fullName": "ANDORRA"
//   },
//   "AG": {
//     "lat": "17.05",
//     "lng": "-61.8",
//     "fullName": "ANTIGUA AND BARBUDA"
//   },
//   "AF": {
//     "lat": "33",
//     "lng": "65",
//     "fullName": "AFGHANISTAN"
//   },
//   "AI": {
//     "lat": "18.25",
//     "lng": "-63.1667",
//     "fullName": "ANGUILLA"
//   },
//   "VI": {
//     "lat": "18.3333",
//     "lng": "-64.8333",
//     "fullName": "VIRGIN ISLANDS, U.S."
//   },
//   "IS": {
//     "lat": "65",
//     "lng": "-18",
//     "fullName": "ICELAND"
//   },
//   "IR": {
//     "lat": "32",
//     "lng": "53",
//     "fullName": "IRAN, ISLAMIC REPUBLIC OF"
//   },
//   "AM": {
//     "lat": "40",
//     "lng": "45",
//     "fullName": "ARMENIA"
//   },
//   "AL": {
//     "lat": "41",
//     "lng": "20",
//     "fullName": "ALBANIA"
//   },
//   "AO": {
//     "lat": "-12.5",
//     "lng": "18.5",
//     "fullName": "ANGOLA"
//   },
//   "AN": {
//     "lat": "12.25",
//     "lng": "-68.75",
//     "fullName": "Netherlands Antilles"
//   },
//   "AQ": {
//     "lat": "-90",
//     "lng": "0",
//     "fullName": "ANTARCTICA"
//   },
//   "AS": {
//     "lat": "-14.3333",
//     "lng": "-170",
//     "fullName": "AMERICAN SAMOA"
//   },
//   "AR": {
//     "lat": "-34",
//     "lng": "-64",
//     "fullName": "ARGENTINA"
//   },
//   "AU": {
//     "lat": "-27",
//     "lng": "133",
//     "fullName": "AUSTRALIA"
//   },
//   "AT": {
//     "lat": "47.3333",
//     "lng": "13.3333",
//     "fullName": "AUSTRIA"
//   },
//   "IO": {
//     "lat": "-6",
//     "lng": "71.5",
//     "fullName": "BRITISH INDIAN OCEAN TERRITORY"
//   },
//   "IN": {
//     "lat": "20",
//     "lng": "77",
//     "fullName": "INDIA"
//   },
//   "TZ": {
//     "lat": "-6",
//     "lng": "35",
//     "fullName": "TANZANIA, UNITED REPUBLIC OF"
//   },
//   "AZ": {
//     "lat": "40.5",
//     "lng": "47.5",
//     "fullName": "AZERBAIJAN"
//   },
//   "IE": {
//     "lat": "53",
//     "lng": "-8",
//     "fullName": "IRELAND"
//   },
//   "ID": {
//     "lat": "-5",
//     "lng": "120",
//     "fullName": "INDONESIA"
//   },
//   "UA": {
//     "lat": "49",
//     "lng": "32",
//     "fullName": "UKRAINE"
//   },
//   "QA": {
//     "lat": "25.5",
//     "lng": "51.25",
//     "fullName": "QATAR"
//   },
//   "MZ": {
//     "lat": "-18.25",
//     "lng": "35",
//     "fullName": "MOZAMBIQUE"
//   },
// }