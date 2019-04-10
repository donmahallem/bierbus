import * as PIXI from "pixi.js";
enum AssetList {
    TEST = "./assets/test.jpg",
    DUCK = "./assets/ducks2.png",
    TEST_SHEET = "./assets/test.json"
}
export class QuackGame {
    private app: PIXI.Application;
    private rootContainer: PIXI.Container;
    private cat: PIXI.Container;
    private duck: PIXI.Container;
    private lastTimestamp: number;
    constructor(private parent: HTMLElement, private gamePortSize: number = 720) {
        let type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);
    }

    public start(): void {
        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
        this.rootContainer = new PIXI.Container();
        this.app.stage.addChild(this.rootContainer);
        this.app.stage.scale.y = -1;
        this.parent.appendChild(this.app.view);
        this.resize();
        window.onresize = (event: UIEvent) => {
            this.resize();
        };
        this.loadAssets()
            .then(this.startGame.bind(this));
    }

    public startGame(): void {

        // Create the cat sprite
        this.cat = new PIXI.Sprite(PIXI.loader.resources[AssetList.TEST].texture);
        this.cat.width = 720;
        this.cat.height = 720;
        // Add the cat to the stage
        this.rootContainer.addChild(this.cat);

        PIXI.loader.resources[AssetList.DUCK].texture.rotate = 8;
        PIXI.loader.resources[AssetList.DUCK].texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.duck = new PIXI.Sprite(PIXI.loader.resources[AssetList.DUCK].texture);
        this.duck.width = 84 * 3;
        this.duck.height = 84;
        this.rootContainer.addChild(this.duck);
        let sheet: any = PIXI.loader.resources[AssetList.TEST_SHEET];
        console.log(sheet);
        for (const tex of sheet.spritesheet.animations['duck']) {

            tex.rotate = 8;
            tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
        let animatedCapguy = new PIXI.extras.AnimatedSprite(sheet.spritesheet.animations["duck"]);

        // set speed, start playback and add it to the stage
        animatedCapguy.animationSpeed = 0.167;
        animatedCapguy.play();
        animatedCapguy.width = 120;
        animatedCapguy.height = 120;
        this.rootContainer.addChild(animatedCapguy);
        //cat.pivot.set(360, 360);
        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    public onAnimationFrame(timestamp: number): void {
        const deltaTime = (this.lastTimestamp ? (timestamp - this.lastTimestamp) : 0);
        this.lastTimestamp = timestamp;
        this.update(deltaTime);
        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    public update(deltaTime: number): void {
        this.cat.rotation += deltaTime / 1000.0;
        this.duck.x += deltaTime / 30;
        if (this.duck.x > 1000) {
            this.duck.x -= 1100;
        }
    }

    public loadAssets(): Promise<void> {
        return new Promise((resolve, reject) => {
            const resourcePaths: string[] = Object.keys(AssetList)
                .map((key: string) => {
                    return AssetList[key];
                });
            PIXI.loader
                .add(resourcePaths)
                .load(resolve);
        });
    }

    public resize(): void {
        const windowWidth: number = window.innerWidth;
        const windowHeight: number = window.innerHeight;
        this.app.view.style.width = windowWidth + "px";
        this.app.view.style.height = windowHeight + "px";
        if (windowWidth < windowHeight) {
            this.app.renderer.resize(this.gamePortSize, windowHeight * this.gamePortSize / windowWidth);
        } else {
            this.app.renderer.resize(windowWidth * this.gamePortSize / windowHeight, this.gamePortSize);
        }
        const topOffset: number = (this.gamePortSize + (3 * this.app.renderer.height)) / 4;
        const leftOffset: number = (this.app.renderer.width - this.gamePortSize) / 2;
        this.rootContainer.position.set(leftOffset, -topOffset);
    }
}
