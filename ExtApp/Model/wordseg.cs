using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtApp.QQ.AI
{
    public class wordseg
    {
        public long app_id { get; set; }
        public long time_stamp { get; set; }
        public string nonce_str { get; set; }
        public string sign { get; set; }
        public string text { get; set; }
    }
}
