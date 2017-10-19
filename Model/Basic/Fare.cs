using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Basic
{
    public class Fare
    {
        public int id { get; set; }
        public string Order_no { get; set; }
        public string Fare_name { get; set; }
        public string Fare_type { get; set; }
        public string Fare_cardtype { get; set; }
        public string Fare_card { get; set; }
        public Double Fliht_ticket { get; set; }
        public Double Fliht_ticket_back { get; set; }
        public int Fliht_build { get; set; }
        public int Fliht_build_back { get; set; }
        public int Fliht_fuel { get; set; }
        public int Fliht_fuel_back { get; set; }
        public int Fliht_insurance { get; set; }
        public int Fliht_state { get; set; }
        public string Flight_easy { get; set; }
        public string Flight_easy_back { get; set; }
        public int service_price { get; set; }
        public int service_price_back { get; set; }
        public int repeal { get; set; }
        public string ticket_no { get; set; }
        public string ticket_no_back { get; set; }
    }
}
