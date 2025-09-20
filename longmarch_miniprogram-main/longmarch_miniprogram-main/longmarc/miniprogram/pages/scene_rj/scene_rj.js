Page({
  data: {
    currentStep: 0,
    currentScene: {},
    history: [],
    isEnding: false,
    // 剧本数据
    scriptData: [
      {
        title: "序幕：告别苏区",
        background: "1934年10月，中央红军主力被迫撤离中央苏区，进行战略转移。你扮演一名红军的连队指导员，与战友们一同踏上了前途未卜的征程。",
        content: "秋风萧瑟，瑞金城外弥漫着离别的愁绪与紧张的气氛。你们的队伍即将开拔。乡亲们默默站在路边，眼中含着泪水与不舍，将仅有的鸡蛋、红薯塞到战士们手中。连长拍了拍你的肩膀，沉声道：“老伙计，这一走，不知何时能回来，前路艰险，同志们的思想工作和路上的难题，咱们得共同扛起来啊。”此时，你看到队伍中几名年轻战士正回头望着家的方向，眼神中流露出迷茫甚至一丝恐惧。你决定：",
        choices: [
          {
            letter: "A",
            text: "严厉训诫：立即上前批评他们动摇军心，要求他们立刻坚定信念。",
            result: "年轻战士被你严厉的态度吓住，虽不敢言语，但情绪更加低落，与周围几名同样思乡的战士产生了消极共鸣。队伍出发时，士气明显不振。（提示：思想工作简单粗暴，适得其反。历史并非如此。）",
            nextStep: -1 // 回溯
          },
          {
            letter: "B",
            text: "温和鼓励：走过去，轻声鼓励，讲述革命的光明前景，稳定他们的情绪。",
            result: "年轻战士们感受到组织的温暖，眼神逐渐坚定起来，默默点了点头，转身融入行军的队伍中。连队士气得到巩固。",
            nextStep: 1 // 进入下一环节
          },
          {
            letter: "C",
            text: "忽略处理：认为这是正常情绪，过度关注反而不好，选择视而不见。",
            result: "消极情绪在部分战士中悄然蔓延，行军队伍变得沉默而压抑，掉队情况开始出现。（提示：未能及时化解思想包袱，埋下隐患。历史并非如此。）",
            nextStep: -1 // 回溯
          },
          {
            letter: "D",
            text: "以身作则：高声唱起红军歌谣，用激昂的歌声感染所有人，带动士气。",
            result: "\"红军不怕远征难...\"雄壮的歌声响起，不仅那几名年轻战士，整个连队的情绪都被调动起来。大家跟着一起唱，步伐变得有力，离别愁绪化为前进的勇气。连长向你投来赞许的目光。",
            nextStep: 1 // 进入下一环节
          }
        ],
        showNext: false,
        showBack: false
      },
      {
        title: "第一关：渡过于都河",
        content: "队伍抵达了长征的第一道屏障——于都河。河面宽阔，水流湍急，国民党军的飞机不时在远处天空盘旋侦察。工兵战友正在紧张地架设浮桥，但进度缓慢，大队人马拥堵在岸边，多停留一分钟就多一分危险。上级命令你们连想办法尽快过河。有战士提议可以尝试徒涉寻找较浅的河道。你会：",
        choices: [
          {
            letter: "A",
            text: "强行架桥：命令战士们不顾疲劳和空袭危险，全力协助工兵加速架桥。",
            result: "数架敌机突然临空轰炸扫射，密集人群来不及疏散，你连协助架桥的战士和工兵战友伤亡惨重，浮桥也被炸毁一段，渡河时间大大延迟。（提示：盲目蛮干，付出巨大代价。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "B",
            text: "冒险徒涉：派出水性好的战士探索浅滩，尝试让部分人员装备涉水过河。",
            result: "探索战士发现一处看似较浅的河段，但中途水流突然变急且深，几名战士被冲走，装备损失严重，涉渡失败。（提示：冒险行动，得不偿失。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "C",
            text: "分散隐蔽：让大部队先分散隐蔽，躲避可能的空袭，等待浮桥架好。",
            result: "部队成功躲避了空袭，但浪费了宝贵时间。后续部队不断抵达，渡口更加拥挤，当浮桥终于架好时，整个纵队的行军序列已出现混乱，延误了突破封锁线的战机。（提示：过于被动，延误整体行动。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "D",
            text: "征集民船：立即派人到附近村庄，动员群众征集渔船、木筏协助渡河。",
            result: "于都河边的乡亲们闻讯而来，纷纷摇来自家的船只，甚至门板、木料都拿来帮助红军。在军民共同努力下，渡河效率大大提高，部队迅速、有序地渡过于都河。",
            nextStep: 2
          }
        ],
        showNext: false,
        showBack: false
      },
      {
        title: "第二关：突破第一道封锁线",
        content: "部队进入粤赣交界山区，即将面对国民党军设置的第一道封锁线。敌军凭借坚固碉堡和火力点严密封锁了通道。正面强攻必然损失巨大。上级要求各部队灵活机动，寻找战机。你连奉命前出侦察。侦察兵回报，发现一条地图上没有标注的小路，但崎岖难行，且不确定能否绕到敌军后方。你会建议：",
        choices: [
          {
            letter: "A",
            text: "主力强攻：主张集中兵力火力，从正面打开缺口，认为小路不确定性太大。",
            result: "你的连队作为主攻先锋，在敌军密集火力下反复冲锋，虽英勇但伤亡极其惨重，未能突破，反而消耗了宝贵的有生力量。（提示：正面硬拼，代价高昂。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "B",
            text: "精兵奇袭：建议抽调精锐组成突击队，沿小路秘密穿插，配合正面作战。",
            result: "上级采纳建议。突击队克服困难成功迂回至敌后，突然发起攻击，敌军阵脚大乱。正面部队乘势进攻，一举突破封锁线。你们连立下头功！",
            nextStep: 3
          },
          {
            letter: "C",
            text: "请示等待：认为情况不明，应立刻将情报上报指挥部，等待上级明确指令。",
            result: "战机稍纵即逝。在你等待回复时，敌军可能发现了小路并派兵封锁，或者友邻部队已经被迫发起强攻。你们的侦察成果未能及时转化为战果。（提示：犹豫不决，贻误战机。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "D",
            text: "放弃小路：认为小路风险过高，可能迷失方向或遭遇伏击，主张另寻他法。",
            result: "你们未能找到更好的路线，最终只能参与代价高昂的正面强攻，或眼睁睁看着突围时机流逝。（提示：过于保守，错失良机。历史并非如此。）",
            nextStep: -1
          }
        ],
        showNext: false,
        showBack: false
      },
      {
        title: "第三关：夜过深山老林",
        content: "为了摆脱追兵，部队连夜行军进入一片陌生的原始森林。漆黑一片，瘴气弥漫，战士们又累又饿，不时有人因疲惫和掉队。电台信号微弱，几乎与上级失联。继续深入可能迷失方向，原地停留又恐追兵赶上。作为指导员，你需要做出决定：",
        choices: [
          {
            letter: "A",
            text: "加速前进：要求队伍不顾疲劳，加快速度，尽快穿过森林。",
            result: "在极度疲劳和视线不清的情况下强行军，掉队、失足、遭遇毒虫野兽袭击的情况大增，非战斗减员严重，队伍几乎失控。（提示：欲速则不达，力量耗尽。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "B",
            text: "原地休整：命令部队停止前进，点火取暖，等待天亮或联络恢复。",
            result: "黑夜中火光和烟雾暴露了位置，引来敌军小股部队的袭扰，或者寒冷和湿气导致更多战士生病，队伍战斗力锐减。（提示：被动停留，陷入险境。历史并非如此。）",
            nextStep: -1
          },
          {
            letter: "C",
            text: "寻找向导：派出侦察小组寻找附近可能存在的山民、猎户，寻求带路。",
            result: "侦察兵幸运地找到了一位熟悉山路的樵夫。在他的带领下，你们选择了最安全、快捷的路径，虽然依然艰苦，但最大限度地保存了队伍，顺利走出森林，追上了大部队。",
            nextStep: 4
          },
          {
            letter: "D",
            text: "分散突围：将连队化整为零，分多个方向探索前进，约定集合地点。",
            result: "森林环境复杂，各小组很快迷失方向，彼此失去联系。大部分人员未能按计划集合，连队建制被打散，力量严重削弱。（提示：分散力量，极易失散。历史并非如此。）",
            nextStep: -1
          }
        ],
        showNext: false,
        showBack: false
      },
      {
        title: "最终结局",
        content: "尽管前途依然漫长险阻，但凭借着坚定的信念、灵活的战术和人民群众的支持，你和你所在的连队成功克服了长征初期的重重困难，保存了革命的火种，跟随大部队踏上了伟大的征程。这段经历只是万里长征的第一步，更多的考验还在前方等待。",
        result: "历史回响： 红军长征是人类历史上的伟大奇迹，它证明了中国共产党及其领导的人民军队坚不可摧的意志和战胜一切困难的勇气。",
        choices: [],
        showNext: false,
        showBack: false
      }
    ]
  },

  onLoad() {
    // 初始化显示序幕
    this.setData({
      currentScene: this.data.scriptData[0]
    });
  },

  // 处理选择
  handleChoice(e) {
    const index = e.currentTarget.dataset.index;
    const currentScene = this.data.currentScene;
    const choice = currentScene.choices[index];
    
    // 保存当前步骤到历史记录
    this.data.history.push(this.data.currentStep);
    
    // 更新当前场景显示结果
    const updatedScene = {
      ...currentScene,
      result: choice.result,
      choices: [],
      showBack: choice.nextStep === -1, // 如果需要回溯，显示返回按钮
      showNext: choice.nextStep !== -1 // 如果有下一步，显示继续按钮
    };
    
    this.setData({
      currentScene: updatedScene,
      currentStep: choice.nextStep === -1 ? this.data.currentStep : choice.nextStep
    });
  },

  // 返回上一步选择
  goBack() {
    const lastStep = this.data.history.pop();
    this.setData({
      currentStep: lastStep,
      currentScene: this.data.scriptData[lastStep],
      isEnding: false
    });
  },

  // 进入下一步
  goNext() {
    const nextStep = this.data.currentStep;
    if (nextStep >= this.data.scriptData.length) {
      return;
    }
    
    // 检查是否是最后一步
    const isEnding = nextStep === this.data.scriptData.length - 1;
    
    this.setData({
      currentScene: this.data.scriptData[nextStep],
      isEnding: isEnding
    });
  },

  // 返回地图页面
  goMap() {
    wx.navigateTo({
      url: '/pages/map/map'
    });
  }
});