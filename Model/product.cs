using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class product
    {
        public int id { get; set; }
        public int cid { get; set; }
        public string pName { get; set; }
        public Double price { get; set; }
        public string imgUrl { get; set; }
        public int enable { get; set; }
        public DateTime addOn { get; set; }
        public int descNum { get; set; }
        public string desp { get; set; }
        public Double radio { get; set; }
    }
}
