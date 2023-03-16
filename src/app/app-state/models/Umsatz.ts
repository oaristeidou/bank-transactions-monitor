export class Umsatz  {
    constructor(buchungstag: string, gegenIban: string, gegenkonto: string, verwendungszweck: string, umsatz: string) {
        this.buchungstag = buchungstag;
        this.gegenIban = gegenIban;
        this.gegenkonto = gegenkonto;
        this.verwendungszweck = verwendungszweck;
        this.umsatz = umsatz;
    }

    buchungstag: string;
    gegenIban: string;
    gegenkonto: string;
    verwendungszweck: string;
    umsatz: string;
}
