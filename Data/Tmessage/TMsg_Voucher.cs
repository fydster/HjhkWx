using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Tmessage
{
    public class TMsg_Voucher
    {
        //TM00507
        public MessageValue first { get; set; }
        /// <summary>
        /// 订单号
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 日期
        /// </summary>
        public MessageValue keyword2 { get; set; }
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
        public TMsg_Voucher GetMessageBody(string first, string keyword1, string keyword2, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",会员昵称:" + keyword1);
            sb.Append(",关注时间:" + keyword2);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Voucher s = new TMsg_Voucher
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
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
            return "-sHjftzZZ-_J1pSntLwlp6kj18tkw_ltJrp_nrN0nSA";
        }
    }
}
