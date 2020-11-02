import request from '@/utils/request'
// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 添加我的频道
export const addMyChannel = channel => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
// 删除我的频道
export const deleteMyChannel = channelID => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelID}`
  })
}
