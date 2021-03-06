const Pencil = require("./../library/Pencil");
const MinimistWrapper = require("./../library/MinimistWrapper");

class Controller {
    minimist;
    pencil;

    constructor() {
        this.minimist = new MinimistWrapper;
        this.pencil = new Pencil();
    }

    run() {
        let args = this.minimist.getArguments();
        const command = args._[0];

        switch (command) {
            case "write":
                this.pencil.write(args._[1]);
                break;
            case "create":
                this.pencil.create(args.point, args.eraser);
                break;
            case "sharpen":
                this.pencil.sharpen();
                break;
            case "erase":
                this.pencil.erase(args._[1]);
                break;
            case "edit":
                this.pencil.edit(args._[1]);
                break;
        }
    }
}
module.exports = Controller;
