export class Umsatz  {
    constructor(buchungstag: Date, gegenIban: string, gegenkonto: string, verwendungszweck: string, umsatz: string) {
        this.buchungstag = new Date(buchungstag);
        this.gegenIban = gegenIban;
        this.gegenkonto = gegenkonto;
        this.verwendungszweck = verwendungszweck;
        this.umsatz = umsatz;
    }

    buchungstag: Date;
    gegenIban: string;
    gegenkonto: string;
    verwendungszweck: string;
    umsatz: string;
}
