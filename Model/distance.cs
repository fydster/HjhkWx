using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class distance
    {
        public string sCity { get; set; }
        public string tCity { get; set; }
        public int cityType { get; set; }
        public int d { get; set; }
    }

    public class distanceList
    {
        public string sCity { get; set; }
        public List<distance> ld { get; set; }
    }
}
