import Region from "../models/Region";

const regionsList = [
  {
    "region_key": "FGC",
    "description": "FIRST Global"
  },
  {
    "region_key": "AK",
    "description": "Alaska"
  },
  {
    "region_key": "AL",
    "description": "Alabama"
  },
  {
    "region_key": "AR",
    "description": "Arkansas"
  },
  {
    "region_key": "AUS",
    "description": "Australia"
  },
  {
    "region_key": "AZ",
    "description": "Arizona"
  },
  {
    "region_key": "CA",
    "description": "California"
  },
  {
    "region_key": "CALA",
    "description": "California - Los Angeles"
  },
  {
    "region_key": "CANAB",
    "description": "Alberta"
  },
  {
    "region_key": "CANBC",
    "description": "British Colombia"
  },
  {
    "region_key": "CASD",
    "description": "California - San Diego"
  },
  {
    "region_key": "CHN",
    "description": "China"
  },
  {
    "region_key": "CHNHK",
    "description": "China - Hong Kong"
  },
  {
    "region_key": "CMP",
    "description": "Championship"
  },
  {
    "region_key": "CO",
    "description": "Colorado"
  },
  {
    "region_key": "CT",
    "description": "Connecticut"
  },
  {
    "region_key": "CZE",
    "description": "Czech Republic"
  },
  {
    "region_key": "DC",
    "description": "District of Columbia"
  },
  {
    "region_key": "DE",
    "description": "Delaware"
  },
  {
    "region_key": "EGY",
    "description": "Egypt"
  },
  {
    "region_key": "FIM",
    "description": "FIRST in Michigan"
  },
  {
    "region_key": "FL",
    "description": "Florida"
  },
  {
    "region_key": "FRN",
    "description": "France"
  },
  {
    "region_key": "GA",
    "description": "Georgia"
  },
  {
    "region_key": "HI",
    "description": "Hawaii"
  },
  {
    "region_key": "IA",
    "description": "Iowa"
  },
  {
    "region_key": "ID",
    "description": "Idaho"
  },
  {
    "region_key": "IL",
    "description": "Illinois"
  },
  {
    "region_key": "IN",
    "description": "Indiana"
  },
  {
    "region_key": "IND",
    "description": "India"
  },
  {
    "region_key": "ISR",
    "description": "Israel"
  },
  {
    "region_key": "JPN",
    "description": "Japan"
  },
  {
    "region_key": "KY",
    "description": "Kentucky"
  },
  {
    "region_key": "LA",
    "description": "Louisiana"
  },
  {
    "region_key": "LBN",
    "description": "Lebanon"
  },
  {
    "region_key": "MA",
    "description": "Massachusetts"
  },
  {
    "region_key": "MD",
    "description": "Maryland"
  },
  {
    "region_key": "MEX",
    "description": "Mexico"
  },
  {
    "region_key": "MIHIS",
    "description": "Michigan - HIS"
  },
  {
    "region_key": "MN",
    "description": "Minnesota"
  },
  {
    "region_key": "MO",
    "description": "Missouri"
  },
  {
    "region_key": "MS",
    "description": "Mississippi"
  },
  {
    "region_key": "MT",
    "description": "Montana"
  },
  {
    "region_key": "NC",
    "description": "North Carolina"
  },
  {
    "region_key": "NCAL",
    "description": "NorCal"
  },
  {
    "region_key": "ND",
    "description": "North Dakota"
  },
  {
    "region_key": "NE",
    "description": "Nebraska"
  },
  {
    "region_key": "NH",
    "description": "New Hampshire"
  },
  {
    "region_key": "NJ",
    "description": "New Jersey"
  },
  {
    "region_key": "NLD",
    "description": "Netherlands"
  },
  {
    "region_key": "NM",
    "description": "New Mexico"
  },
  {
    "region_key": "NV",
    "description": "Nevada"
  },
  {
    "region_key": "NY",
    "description": "New York"
  },
  {
    "region_key": "NYC",
    "description": "New York - NYC"
  },
  {
    "region_key": "NYEXC",
    "description": "New York - Excelsior"
  },
  {
    "region_key": "NYHV",
    "description": "New York - Hudson Valley"
  },
  {
    "region_key": "NYLI",
    "description": "New York - Long Island"
  },
  {
    "region_key": "NZL",
    "description": "New Zealand"
  },
  {
    "region_key": "OH",
    "description": "Ohio"
  },
  {
    "region_key": "OK",
    "description": "Oklahoma"
  },
  {
    "region_key": "OR",
    "description": "Oregon"
  },
  {
    "region_key": "PA",
    "description": "Pennsylvania"
  },
  {
    "region_key": "RI",
    "description": "Rhode Island"
  },
  {
    "region_key": "ROU",
    "description": "Romania"
  },
  {
    "region_key": "RUS",
    "description": "Russia"
  },
  {
    "region_key": "SC",
    "description": "South Carolina"
  },
  {
    "region_key": "SD",
    "description": "South Dakota"
  },
  {
    "region_key": "SKR",
    "description": "South Korea"
  },
  {
    "region_key": "TWN",
    "description": "Taiwan"
  },
  {
    "region_key": "TX",
    "description": "Texas"
  },
  {
    "region_key": "TXARL",
    "description": "Texas - Arlington"
  },
  {
    "region_key": "TXHOU",
    "description": "Texas - Houston"
  },
  {
    "region_key": "TXLUB",
    "description": "Texas - Lubbock"
  },
  {
    "region_key": "TXSA",
    "description": "Texas - San Antonio"
  },
  {
    "region_key": "UT",
    "description": "Utah"
  },
  {
    "region_key": "VA",
    "description": "Virginia"
  },
  {
    "region_key": "VT",
    "description": "Vermont"
  },
  {
    "region_key": "WA",
    "description": "Washington"
  },
  {
    "region_key": "WI",
    "description": "Wisconsin"
  },
  {
    "region_key": "WV",
    "description": "West Virginia"
  },
  {
    "region_key": "WY",
    "description": "Wyoming"
  },
  {
    "region_key": "ZAF",
    "description": "South Africa"
  }
];

export const Regions: Region[] = regionsList.map(region => new Region(region.region_key, region.description));