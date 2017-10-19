using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Basic
{
    public class ChangeLog
    {
        public int id { get; set; }
        public string Order_no { get; set; }
        public string Record_no { get; set; }
        public string Content { get; set; }
        public DateTime Otime { get; set; }
        public string ip { get; set; }
    }
}
