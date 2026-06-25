export interface District {
  name: string;
  province: string;
}

export const DISTRICTS: District[] = [
  { name: "Gasabo", province: "Kigali" },
  { name: "Nyarugenge", province: "Kigali" },
  { name: "Kicukiro", province: "Kigali" },
  { name: "Musanze", province: "Northern" },
  { name: "Burera", province: "Northern" },
  { name: "Gakenke", province: "Northern" },
  { name: "Gicumbi", province: "Northern" },
  { name: "Rulindo", province: "Northern" },
  { name: "Rubavu", province: "Western" },
  { name: "Karongi", province: "Western" },
  { name: "Nyabihu", province: "Western" },
  { name: "Ngororero", province: "Western" },
  { name: "Nyamasheke", province: "Western" },
  { name: "Rutsiro", province: "Western" },
  { name: "Rusizi", province: "Western" },
  { name: "Huye", province: "Southern" },
  { name: "Nyanza", province: "Southern" },
  { name: "Gisagara", province: "Southern" },
  { name: "Kamonyi", province: "Southern" },
  { name: "Muhanga", province: "Southern" },
  { name: "Nyamagabe", province: "Southern" },
  { name: "Nyaruguru", province: "Southern" },
  { name: "Ruhango", province: "Southern" },
  { name: "Rwamagana", province: "Eastern" },
  { name: "Bugesera", province: "Eastern" },
  { name: "Gatsibo", province: "Eastern" },
  { name: "Kayonza", province: "Eastern" },
  { name: "Kirehe", province: "Eastern" },
  { name: "Ngoma", province: "Eastern" },
  { name: "Nyagatare", province: "Eastern" },
];

export const EA_CITIES = [
  "Nairobi, Kenya",
  "Kampala, Uganda",
  "Dar es Salaam, Tanzania",
  "Bujumbura, Burundi",
  "Juba, South Sudan",
];

export const getDistrictsByProvince = (): Record<string, District[]> => {
  return DISTRICTS.reduce(
    (acc, district) => {
      if (!acc[district.province]) {
        acc[district.province] = [];
      }
      acc[district.province].push(district);
      return acc;
    },
    {} as Record<string, District[]>
  );
};
