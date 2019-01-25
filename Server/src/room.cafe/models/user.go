package models

import (
	"components/timestamp"
)

// User 用户
type User struct {
	ID                uint                 `json:"id"                 gorm:"primary_key"`           // 主键
	Email             string               `json:"email"              gorm:"size:128;unique_index"` // 邮箱
	Name              string               `json:"name"               gorm:"size:128"`              // 昵称
	Avatar            string               `json:"avatar"`                                          // 头像 Etag
	Gender            string               `json:"gender"             gorm:"size:10"`               // 性别
	Birthday          *timestamp.Timestamp `json:"birthday"`                                        // 生日
	Bio               string               `json:"bio"`                                             // 个人简介
	RegisteredIP      string               `json:"registered_ip"      gorm:"size:128"`              // 注册 IP
	Password          string               `json:"password,omitempty" sql:"-"`                      // 密码
	EncryptedPassword []byte               `json:"-"`                                               // 加密密钥
	CurrentSignInAt   timestamp.Timestamp  `json:"current_sign_in_at"`                              // 当前登录时间
	CurrentSignInIP   string               `json:"current_sign_in_ip" gorm:"size:128"`              // 当前登录 IP
	LastSignInAt      timestamp.Timestamp  `json:"last_sign_in_at"`                                 // 上次登录时间
	LastSignInIP      string               `json:"last_sign_in_ip"    gorm:"size:128"`              // 上次登录 IP
	FailedAttempts    int                  `json:"failed_attempts"`                                 // 失败尝试次数
	UnlockToken       string               `json:"unlock_token"`                                    // 解锁 token
	LockedAt          *timestamp.Timestamp `json:"locked_at"`                                       // 锁定时间

	CreatedAt timestamp.Timestamp `json:"created_at"`
	UpdatedAt timestamp.Timestamp `json:"updated_at"`
}
