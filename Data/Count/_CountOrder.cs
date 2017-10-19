using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data
{
    public class _CountOrder:DbCenter
    {
        public int IsOrderExsit(string orderNo)
        {
            int oNum = 0;
            try
            {
                oNum = Convert.ToInt32(helper.GetOne("select count(id) as t from t_count_order where orderNo = '" + orderNo + "'"));
            }
            catch
            {
                oNum = 0;
            }
            return oNum;
        }
    }
}
