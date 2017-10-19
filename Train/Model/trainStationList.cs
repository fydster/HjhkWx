using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class trainStationList
    {
        public string station { get; set; }
        public trainStation train { get; set; }
    }

    public class trainStation
    {
        public string hot { get; set; }
        public string priority { get; set; }
        public string match { get; set; }
        public string stationCode { get; set; }
    }
}
