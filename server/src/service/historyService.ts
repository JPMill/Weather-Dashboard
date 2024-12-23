import {promises as fs} from "fs";
import {v4 as uuidv4} from "uuid";
// TODO: Define a City class with name and id properties
class City {
  constructor(
    public id: string,
    public name: string
  ) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string = "searchHistory.json"
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) as City[];
    } catch (error) {
      if ((error as any).code === "ENOENT") {
        await fs.writeFile(this.filePath, JSON.stringify([]));
        return [];
      } else {
        throw error;
      }
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export { City };
export default new HistoryService();
