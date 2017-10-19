using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Basic
{
    public class OrderInfo
    {
        public string Order_no { get; set; }
        public Order order { get; set; }
        public List<Fare> fare { get; set; }
        public List<ChangeLog> changeLog { get; set; }
    }
}
