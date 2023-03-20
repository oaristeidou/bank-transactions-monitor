export class Category {
  private name: string;
  private data: string[] = []
  private color: string;


  constructor(categoryName: string, valuesBySector: string[]) {
    this.name = categoryName;
    this.data = valuesBySector;
    this.color = "#6" + Math.floor(Math.random()*16777215).toString(16).substring(0,5);
  }


  get getName(): string {
    return this.name;
  }

  get getData(): string[] {
    return this.data;
  }
}
