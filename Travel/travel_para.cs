using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class travel_para
    {
        public string key { get; set; }
        public string value { get; set; }
        public int vType { get; set; }
    }

    public class travel_para_data
    {
        public string key { get; set; }
        public List<travel_para> lt { get; set; }
    }
}
