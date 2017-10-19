using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class _CancelOrder
    {
        public string url = "dto/trainOrder/cancelOrder";

        /// <summary>
        /// 取消订单
        /// </summary>
        /// <returns></returns>
        public string CancelOrder(string orderNo)
        {
            List<train_para> lt = new List<train_para>();
            //添加参数
            train_para t = new train_para
            {
                key = "orderNo",
                value = orderNo
            };
            lt.Add(t);
            t = new train_para
            {
                key = "method",
                value = "cancelOrder"
            };
            lt.Add(t);
            train_get tg = new train_get
            {
                url = url,
                para = lt
            };
            string result = new _Train().GetResult(tg, "GET");
            return result;
        }
    }
}
