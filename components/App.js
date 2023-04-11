import Cake from "../src/bundle.js";
// import Button from "./Button.js";
// import Modal from "./Modal.js";

// import HomePage from "./HomePage";

const App = new Cake({
    name: "App",
});

const Button = App.Component("Button", "#Button", {
    handlers: {
        async destroy() {
            // await this.reset();

            console.log(16, this);
        },
        click(e) {
            console.log("button is clicked");
        },
    },
    subscribe: {},
});
const Modal = App.Component("Modal", "#Modal", {
    handlers: {
        async destroy() {
            // await this.reset();
        },
    },
    subscribe: {
        Button: {
            click() {
                console.log(28, this);

                this.scope("destroyed", "button fire destroy");
            },
        },
    },
});

App.registerRouter(
    {
        "/": {
            name: "about",
            display: "About",
            components: [Button, Modal],
            auth: false,
        },

        404: function () {
            return "/login";
        },
    },

    {
        auth: {
            401: "login",
            // verify: ["api", "verify"],
            // valid: {},
        },
        components: {
            // tabs:{
            //     rerender:['/',]
            // },
            // header:{
            //     rerender:['/',]
            // }
        },
    }
);

// router.on("beforeload", function () {});
// router.on("afterload", function () {});
// router.on("change", function () {});
// router.on("error", function () {});

export default App;
