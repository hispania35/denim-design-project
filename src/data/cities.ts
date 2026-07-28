export interface CityData {
  slug: string;
  name: string;
  nameIn: string;
  nameGenitive: string;
  aliases: string[];
  country?: "ru" | "by";
}

export const cities: CityData[] = [
  { slug: "moskva", name: "Москва", nameIn: "в Москве", nameGenitive: "Москвы", aliases: ["москва", "moscow", "moskva"] },
  { slug: "sankt-peterburg", name: "Санкт-Петербург", nameIn: "в Санкт-Петербурге", nameGenitive: "Санкт-Петербурга", aliases: ["санкт-петербург", "петербург", "spb", "saint petersburg", "st petersburg", "sankt-peterburg", "petersburg"] },
  { slug: "novosibirsk", name: "Новосибирск", nameIn: "в Новосибирске", nameGenitive: "Новосибирска", aliases: ["новосибирск", "novosibirsk"] },
  { slug: "ekaterinburg", name: "Екатеринбург", nameIn: "в Екатеринбурге", nameGenitive: "Екатеринбурга", aliases: ["екатеринбург", "yekaterinburg", "ekaterinburg"] },
  { slug: "kazan", name: "Казань", nameIn: "в Казани", nameGenitive: "Казани", aliases: ["казань", "kazan"] },
  { slug: "nizhniy-novgorod", name: "Нижний Новгород", nameIn: "в Нижнем Новгороде", nameGenitive: "Нижнего Новгорода", aliases: ["нижний новгород", "nizhniy novgorod", "nizhny novgorod"] },
  { slug: "chelyabinsk", name: "Челябинск", nameIn: "в Челябинске", nameGenitive: "Челябинска", aliases: ["челябинск", "chelyabinsk"] },
  { slug: "krasnoyarsk", name: "Красноярск", nameIn: "в Красноярске", nameGenitive: "Красноярска", aliases: ["красноярск", "krasnoyarsk"] },
  { slug: "samara", name: "Самара", nameIn: "в Самаре", nameGenitive: "Самары", aliases: ["самара", "samara"] },
  { slug: "ufa", name: "Уфа", nameIn: "в Уфе", nameGenitive: "Уфы", aliases: ["уфа", "ufa"] },
  { slug: "rostov-na-donu", name: "Ростов-на-Дону", nameIn: "в Ростове-на-Дону", nameGenitive: "Ростова-на-Дону", aliases: ["ростов-на-дону", "ростов", "rostov-on-don", "rostov"] },
  { slug: "omsk", name: "Омск", nameIn: "в Омске", nameGenitive: "Омска", aliases: ["омск", "omsk"] },
  { slug: "krasnodar", name: "Краснодар", nameIn: "в Краснодаре", nameGenitive: "Краснодара", aliases: ["краснодар", "krasnodar"] },
  { slug: "voronezh", name: "Воронеж", nameIn: "в Воронеже", nameGenitive: "Воронежа", aliases: ["воронеж", "voronezh"] },
  { slug: "perm", name: "Пермь", nameIn: "в Перми", nameGenitive: "Перми", aliases: ["пермь", "perm"] },
  { slug: "volgograd", name: "Волгоград", nameIn: "в Волгограде", nameGenitive: "Волгограда", aliases: ["волгоград", "volgograd"] },
  { slug: "saratov", name: "Саратов", nameIn: "в Саратове", nameGenitive: "Саратова", aliases: ["саратов", "saratov"] },
  { slug: "tyumen", name: "Тюмень", nameIn: "в Тюмени", nameGenitive: "Тюмени", aliases: ["тюмень", "tyumen"] },
  { slug: "tolyatti", name: "Тольятти", nameIn: "в Тольятти", nameGenitive: "Тольятти", aliases: ["тольятти", "tolyatti", "togliatti"] },
  { slug: "izhevsk", name: "Ижевск", nameIn: "в Ижевске", nameGenitive: "Ижевска", aliases: ["ижевск", "izhevsk"] },
  { slug: "barnaul", name: "Барнаул", nameIn: "в Барнауле", nameGenitive: "Барнаула", aliases: ["барнаул", "barnaul"] },
  { slug: "ulyanovsk", name: "Ульяновск", nameIn: "в Ульяновске", nameGenitive: "Ульяновска", aliases: ["ульяновск", "ulyanovsk"] },
  { slug: "irkutsk", name: "Иркутск", nameIn: "в Иркутске", nameGenitive: "Иркутска", aliases: ["иркутск", "irkutsk"] },
  { slug: "habarovsk", name: "Хабаровск", nameIn: "в Хабаровске", nameGenitive: "Хабаровска", aliases: ["хабаровск", "khabarovsk"] },
  { slug: "yaroslavl", name: "Ярославль", nameIn: "в Ярославле", nameGenitive: "Ярославля", aliases: ["ярославль", "yaroslavl"] },
  { slug: "vladivostok", name: "Владивосток", nameIn: "во Владивостоке", nameGenitive: "Владивостока", aliases: ["владивосток", "vladivostok"] },
  { slug: "mahachkala", name: "Махачкала", nameIn: "в Махачкале", nameGenitive: "Махачкалы", aliases: ["махачкала", "makhachkala"] },
  { slug: "tomsk", name: "Томск", nameIn: "в Томске", nameGenitive: "Томска", aliases: ["томск", "tomsk"] },
  { slug: "orenburg", name: "Оренбург", nameIn: "в Оренбурге", nameGenitive: "Оренбурга", aliases: ["оренбург", "orenburg"] },
  { slug: "kemerovo", name: "Кемерово", nameIn: "в Кемерово", nameGenitive: "Кемерово", aliases: ["кемерово", "kemerovo"] },
  { slug: "novokuznetsk", name: "Новокузнецк", nameIn: "в Новокузнецке", nameGenitive: "Новокузнецка", aliases: ["новокузнецк", "novokuznetsk"] },
  { slug: "ryazan", name: "Рязань", nameIn: "в Рязани", nameGenitive: "Рязани", aliases: ["рязань", "ryazan"] },
  { slug: "naberezhnye-chelny", name: "Набережные Челны", nameIn: "в Набережных Челнах", nameGenitive: "Набережных Челнов", aliases: ["набережные челны", "naberezhnye chelny"] },
  { slug: "astrahan", name: "Астрахань", nameIn: "в Астрахани", nameGenitive: "Астрахани", aliases: ["астрахань", "astrakhan"] },
  { slug: "penza", name: "Пенза", nameIn: "в Пензе", nameGenitive: "Пензы", aliases: ["пенза", "penza"] },
  { slug: "lipetsk", name: "Липецк", nameIn: "в Липецке", nameGenitive: "Липецка", aliases: ["липецк", "lipetsk"] },
  { slug: "kirov", name: "Киров", nameIn: "в Кирове", nameGenitive: "Кирова", aliases: ["киров", "kirov"] },
  { slug: "cheboksary", name: "Чебоксары", nameIn: "в Чебоксарах", nameGenitive: "Чебоксар", aliases: ["чебоксары", "cheboksary"] },
  { slug: "tula", name: "Тула", nameIn: "в Туле", nameGenitive: "Тулы", aliases: ["тула", "tula"] },
  { slug: "kaliningrad", name: "Калининград", nameIn: "в Калининграде", nameGenitive: "Калининграда", aliases: ["калининград", "kaliningrad"] },
  { slug: "balashiha", name: "Балашиха", nameIn: "в Балашихе", nameGenitive: "Балашихи", aliases: ["балашиха", "balashikha"] },
  { slug: "kursk", name: "Курск", nameIn: "в Курске", nameGenitive: "Курска", aliases: ["курск", "kursk"] },
  { slug: "stavropol", name: "Ставрополь", nameIn: "в Ставрополе", nameGenitive: "Ставрополя", aliases: ["ставрополь", "stavropol"] },
  { slug: "ulan-ude", name: "Улан-Удэ", nameIn: "в Улан-Удэ", nameGenitive: "Улан-Удэ", aliases: ["улан-удэ", "ulan-ude"] },
  { slug: "tver", name: "Тверь", nameIn: "в Твери", nameGenitive: "Твери", aliases: ["тверь", "tver"] },
  { slug: "magnitogorsk", name: "Магнитогорск", nameIn: "в Магнитогорске", nameGenitive: "Магнитогорска", aliases: ["магнитогорск", "magnitogorsk"] },
  { slug: "sochi", name: "Сочи", nameIn: "в Сочи", nameGenitive: "Сочи", aliases: ["сочи", "sochi"] },
  { slug: "ivanovo", name: "Иваново", nameIn: "в Иваново", nameGenitive: "Иваново", aliases: ["иваново", "ivanovo"] },
  { slug: "bryansk", name: "Брянск", nameIn: "в Брянске", nameGenitive: "Брянска", aliases: ["брянск", "bryansk"] },
  { slug: "belgorod", name: "Белгород", nameIn: "в Белгороде", nameGenitive: "Белгорода", aliases: ["белгород", "belgorod"] },
  { slug: "surgut", name: "Сургут", nameIn: "в Сургуте", nameGenitive: "Сургута", aliases: ["сургут", "surgut"] },
  { slug: "minsk", name: "Минск", nameIn: "в Минске", nameGenitive: "Минска", aliases: ["минск", "minsk"], country: "by" },
  { slug: "gomel", name: "Гомель", nameIn: "в Гомеле", nameGenitive: "Гомеля", aliases: ["гомель", "gomel", "homyel"], country: "by" },
  { slug: "brest", name: "Брест", nameIn: "в Бресте", nameGenitive: "Бреста", aliases: ["брест", "brest"], country: "by" },
  { slug: "vitebsk", name: "Витебск", nameIn: "в Витебске", nameGenitive: "Витебска", aliases: ["витебск", "vitebsk"], country: "by" },
  { slug: "grodno", name: "Гродно", nameIn: "в Гродно", nameGenitive: "Гродно", aliases: ["гродно", "grodno", "hrodna"], country: "by" },
  { slug: "mogilev", name: "Могилёв", nameIn: "в Могилёве", nameGenitive: "Могилёва", aliases: ["могилёв", "могилев", "mogilev", "mahilyow"], country: "by" },
];

export const citySlugs = cities.map((c) => c.slug);

export const belarusCities = cities.filter((c) => c.country === "by");

export const getCityBySlug = (slug?: string): CityData | undefined =>
  cities.find((c) => c.slug === slug);

export const getCityByName = (name?: string): CityData | undefined => {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return cities.find((c) => c.aliases.includes(normalized));
};