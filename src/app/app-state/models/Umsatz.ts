export class Umsatz  {
    constructor(buchungstag: Date, gegenIban: string, gegenkonto: string, verwendungszweck: string, kategory: string, umsatz: string, position: number) {
        this.buchungstag = new Date(buchungstag);
        this.gegenIban = gegenIban;
        this.gegenkonto = gegenkonto;
        this.verwendungszweck = verwendungszweck;
        this.kategory = kategory;
        this.umsatz = umsatz;
        this.position = position;
    }

    buchungstag: Date;
    gegenIban: string;
    gegenkonto: string;
    verwendungszweck: string;
    kategory: string;
    umsatz: string;
    position: number;
}
