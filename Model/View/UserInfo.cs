using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class UserInfo
    {
        public int id { get; set; }
        /// <summary>
        /// 微信唯一ID
        /// </summary>
        public string openId { get; set; }
        /// <summary>
        /// 用户来源
        /// </summary>
        public string source { get; set; }
        /// <summary>
        /// 用户手机号码
        /// </summary>
        public string mobile { get; set; }
        /// <summary>
        /// 用户姓名
        /// </summary>
        public string contact { get; set; }
        /// <summary>
        /// 用户微信头像地址
        /// </summary>
        public string photoUrl { get; set; }
        /// <summary>
        /// 用户微信所属地区
        /// </summary>
        public string area { get; set; }
        /// <summary>
        /// 用户性别
        /// </summary>
        public int sex { get; set; }
        /// <summary>
        /// 用户昵称
        /// </summary>
        public string nickName { get; set; }
        /// <summary>
        /// 用户加入时间
        /// </summary>
        public DateTime addOn { get; set; }

        /// <summary>
        /// 用户分类
        /// </summary>
        public int cId { get; set; }
        public string cName { get; set; }
        public string pName { get; set; }
        public int isBind { get; set; }
        public DateTime bindOn { get; set; }

        public string jtID { get; set; }
    }
}
