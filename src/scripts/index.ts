import "./../styles/appStyles.scss";
interface ITest {
    test: number;
}
const getComponent = () => {
    return import(/* webpackChunkName: "quackgame" */ "./quack-game").then((game) => {
        const g: any = new game.QuackGame(document.getElementsByTagName("game-root")[0] as any);
        g.start();
    }).catch((error) => "An error occurred while loading the component");
};

getComponent().then((component) => {
    const comp = component;
});
