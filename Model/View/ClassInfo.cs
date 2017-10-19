using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class ClassInfo
    {
        public int id { get; set; }
        public int pId { get; set; }
        public string name { get; set; }
        public string logoUrl { get; set; }
        public int enable { get; set; }
        public DateTime addOn { get; set; }
        public int cType { get; set; }
        public int isShow { get; set; }
        public int sType { get; set; }
        public string defaultUrl { get; set; }

        public int num { get; set; }
    }
}
