using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class templateMsg
    {
        public int id { get; set; }
        public string openId { get; set; }
        public string msgBody { get; set; }
        public string msgContent { get; set; }
        public string msgUrl { get; set; }
        public string msgId { get; set; }
        public DateTime sendTime { get; set; }
        public int enable { get; set; }
        public int toUser { get; set; }
        public string orderNo { get; set; }
    }
}
