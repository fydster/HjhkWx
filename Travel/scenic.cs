using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class scenic
    {
        public string scenicId { get; set; }
        public string scenicName { get; set; }
        public string address { get; set; }
        public string glocation { get; set; }
        public string salePrice { get; set; }
        public string blocation { get; set; }
        public string newPicUrl { get; set; }
        public string bizTime { get; set; }
        public List<tickets> ticketList { get; set; }
        public List<tickets> disTickets { get; set; }
    }

    public class tickets
    {
        public int productId { get; set; }
        public string productName { get; set; }
        public string salePrice { get; set; }
        public string webPrice { get; set; }


    }
}
