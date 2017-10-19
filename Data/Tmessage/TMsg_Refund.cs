using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Tmessage
{
    //OPENTM207284059--退款通知
    public class TMsg_Refund
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 退款金额
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 退款时间
        /// </summary>
        public MessageValue keyword2 { get; set; }
        /// <summary>
        /// 订单编号
        /// </summary>
        public MessageValue keyword3 { get; set; }
        /// <summary>
        /// 后缀
        /// </summary>
        public MessageValue remark { get; set; }

        /// <summary>
        /// 获取模板消息体
        /// </summary>
        /// <param name="first"></param>
        /// <param name="keyword1"></param>
        /// <param name="keyword2"></param>
        /// <param name="keyword3"></param>
        /// <param name="keyword4"></param>
        /// <param name="remark"></param>
        /// <returns></returns>
        public TMsg_Refund GetMessageBody(string first, string keyword1, string keyword2, string keyword3,string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",退款金额:" + keyword1);
            sb.Append(",退款时间:" + keyword2);
            sb.Append(",订单编号:" + keyword3);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Refund s = new TMsg_Refund
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
                keyword3 = new MessageValue { value = keyword3, color = "" },
                remark = new MessageValue { value = remark, color = "#428bca" }
            };
            return s;
        }

        /// <summary>
        /// 模板消息ID
        /// </summary>
        /// <returns></returns>
        public string Key()
        {
            return "qi5C3zJQuO4z64wrCVvpWnQgYqJO57KV4WjGsVL9-Uk";
        }
    }
}
