import "./../styles/appStyles.scss";
const getComponent = () => {
    return import(/* webpackChunkName: "quackgame" */ "./quack-game").then((game) => {
        const g: any = new game.QuackGame(document.getElementsByTagName("map-root")[0] as any);
        g.start();
    }).catch((error) => "An error occurred while loading the component");
};

getComponent().then((component) => {
    // tslint:disable-next-line:no-console
    console.log("running");
});
