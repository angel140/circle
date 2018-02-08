import { CircleWidth, CircleColors, GridHeight, GridWidth } from "./constant";
import { getRandom, clone } from "./common";


const { ccclass, property } = cc._decorator;
let configdata = null;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Graphics)
    graphic: cc.Graphics = null;

    @property({ type: cc.Prefab })
    trigger_prefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    circle_prefab: cc.Prefab = null;


    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Label)
    currStep_lb: cc.Label = null;


    @property(cc.Node)
    gameNode: cc.Node = null;

    @property(cc.Node)
    startNode: cc.Node = null;


    @property(cc.Node)
    levelNode: cc.Node = null;
    @property(cc.Node)
    aboutNode: cc.Node = null;

    @property(cc.Layout)
    levelList: cc.Layout = null;

    @property({ type: cc.Prefab })
    levelItem_prefab: cc.Prefab = null;

    @property(cc.Node)
    overPanel: cc.Node = null;

    @property(cc.Node)
    overPanelLayout: cc.Node = null;

    nodeList = [];
    levelData = null;
    circleList = [];

    currStep = 0;
    currLevel = 0;
    needStep = 0;

    @property(cc.Label)
    level_lb: cc.Label = null;

    gamestart = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.load(cc.url.raw("resources/data/level.json"), (err, res) => {
            if (err) {
                cc.error(err.message || err);
                return;
            }


            cc.log(JSON.stringify(res.level1));
            configdata = res;
            this.setLevelPanel();

        });


        let isShowGrid = false;

        if (isShowGrid) {
            this.graphic.clear();

            this.graphic.lineWidth = 2;


            for (let i = 0; i < 15; i++) {

                this.graphic.strokeColor = CircleColors[i % 6];
                this.graphic.moveTo(0, GridHeight * i);
                this.graphic.lineTo(720, GridHeight * i);
                //this.graphic.circle(getRandom(0,500),getRandom(0,500),getRandom(0,100));

                this.graphic.stroke();
            }

            for (let j = 0; j < 9; j++) {
                this.graphic.strokeColor = CircleColors[j % 6];
                this.graphic.moveTo(GridWidth * j, 0);
                this.graphic.lineTo(GridWidth * j, 1280);
                //this.graphic.circle(getRandom(0,500),getRandom(0,500),getRandom(0,100));
                this.graphic.stroke();

            }

        }
        this.startNode.active = true;
        this.gameNode.active = true;
        this.levelNode.active = true;


    }
    onBackLevel() {
        this.startNode.active = false;
        this.gameNode.active = false;
        this.levelNode.active = true;
        this.levelList.node.destroyAllChildren();
        this.setLevelPanel();

    }
    onBackStart() {
        this.startNode.active = true;
        this.gameNode.active = false;
        this.levelNode.active = false;


    }
    onAboutBackStart() {

        this.aboutNode.active = false;


    }
    setLevelPanel() {


        for (let i = 1; i < 100000; i++) {

            let itemData = configdata["level" + String(i)]
            if (itemData) {
                let str: string = cc.sys.localStorage.getItem("savekey" + String(i)) || null;
                if (str) {

                }
                let item = cc.instantiate(this.levelItem_prefab);
                item.getComponent('levelItem').setData(itemData, (id) => {
                    this.currLevel = id;
                    this.currStep = 0;
                    this.needStep = 0;
                    this.levelData = clone(configdata["level" + String(id)]);
                    this.onReplay();
                    this.levelNode.active = false;
                    this.startNode.active = false;
                    this.gameNode.active = true;
                    this.overPanel.active = false;

                });
                this.levelList.node.addChild(item);

            }
            else {
                break;
            }

        }
    }
    onStartGame() {
        this.startNode.active = false;
        this.gameNode.active = false;
        this.levelNode.active = true;
        //this.startNode.width +=10;
        // this.startNode.height +=10;
    }
    onAbout() {
        this.aboutNode.active = true;
    }
    initNode() {
        for (let i = 0; i < this.levelData.nodes.length; i++) {
            let tr = cc.instantiate(this.trigger_prefab);
            let tempdata = this.levelData.nodes[i];
            tr.setPosition(cc.p(GridWidth * tempdata.pos[0] + 40, GridHeight * tempdata.pos[1] + 42));
            this.nodeList.push(tr);
            tr.getComponent("trigger").setData(tempdata, this);
            this.mainNode.addChild(tr);
        }

    }
    createCircle(cid, trigger) {
        let c = cc.instantiate(this.circle_prefab);
        c.setPosition(cc.p(trigger.node.x, trigger.node.y));
        c.getComponent("circle").filterList.push(trigger.node);
        c.getComponent("circle").setData(cid);
        this.mainNode.addChild(c);
        this.circleList.push(c);
        let path: string;

        path = 'resources/sound/' + (cid + 1) + '.mp3';
        cc.audioEngine.play(cc.url.raw(path), false, 1);

    }
    isCanOperation() {
        if (this.currStep >= this.needStep || this.gamestart == false) {
            return false
        }
        else {
            return true

        }
    }
    onReplay() {
        this.overPanel.active = false;
        this.circleList.forEach(element => {
            element.destroy();

        });
        this.nodeList.forEach(element => {
            element.destroy();

        });

        this.nodeList = [];
        this.levelData = null;
        this.circleList = [];
        this.currStep = 0;


        this.levelData = clone(configdata["level" + String(this.currLevel)]);
        this.needStep = this.levelData.needSteps;
        this.initNode();
        this.gamestart = true;
        this.currStep_lb.string = String(this.needStep - this.currStep);

    }
    addStep() {
        this.currStep++;
        this.currStep_lb.string = String(this.needStep - this.currStep);
    }
    onNextLevel() {
        this.currLevel++;
        this.onReplay();
    }
    isCanOver() {

        let iso = true;
        for (let i = this.circleList.length; i > 0; i--) {
            let c = this.circleList[i - 1];
            let radius = c.getComponent("circle").radius;
            if ((radius * radius) < 1280 * 1280 + 720 * 720) {
                iso = false;
            }
            else {
                this.circleList.splice(i - 1, 1);
                c.destroy();
            }

        }
        return iso

    }
    update(dt) {


        if (!this.gamestart)
            return;
        this.circleList.forEach(circle => {
            this.nodeList.forEach(node => {
                let vpos = cc.p(circle.getPosition())
                let dpos = cc.p(node.getPosition())
                let radius = circle.getComponent("circle").radius;

                if (cc.pDistance(vpos, dpos) <= radius) {


                    if (!circle.getComponent("circle").isIgnore(node)) {
                        circle.getComponent("circle").filterList.push(node);
                        let data = node.getComponent("trigger").data.circles;
                        if (data.length > 0 && circle.getComponent("circle").cid == data[data.length - 1]) {
                            node.getComponent("trigger").createCircle();
                        }
                    }



                }

            });

        });


        let gameover = true;

        for (let i = 0; i < this.nodeList.length; i++) {
            let node = this.nodeList[i];
            let data = node.getComponent("trigger").data.circles;
            if (data.length > 0) {
                gameover = false;
                break;
            }
        }

        if (!gameover && (this.currStep >= this.levelData.needSteps && this.isCanOver())) {

            cc.log("通关失败");
            this.overPanel.getChildByName('tips').getComponent(cc.Label).string = '通关失败';
            this.overPanel.active = true;
            this.gamestart = false;
            this.overPanelLayout.getChildByName('nextButton').active = false;

        }
        else if (gameover && (this.currStep <= this.levelData.needSteps && this.isCanOver())) {
            cc.log("通过成功")
            this.overPanel.getChildByName('tips').getComponent(cc.Label).string = '通关成功';
            this.overPanel.active = true;
            this.gamestart = false;
            let itemData = configdata["level" + String(this.currLevel + 1)]
            this.overPanelLayout.getChildByName('nextButton').active = false;
            cc.sys.localStorage.setItem("savekey" + String(this.currLevel), "true");
            if (itemData) {
                this.overPanelLayout.getChildByName('nextButton').active = true;
            }

        }

        this.level_lb.string = "第" + String(this.currLevel) + "关";

    }



}
