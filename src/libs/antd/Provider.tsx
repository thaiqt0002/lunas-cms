'use client'
import { useServerInsertedHTML } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'

export default function Provider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache())

  const alreadyInserted = useRef(new Set<string>())

  useServerInsertedHTML(() => {
    if (cache.cache.size === 0) {
      return
    }
    for (const key of alreadyInserted.current.keys()) {
      cache.cache.delete(key)
    }
    const html = extractStyle(cache, true)
    for (const key of cache.cache.keys()) {
      alreadyInserted.current.add(key)
    }
    cache.cache.clear()
    return <style dangerouslySetInnerHTML={{ __html: html }} className="antd" />
  })
  return (
    <AntdRegistry>
      <StyleProvider layer cache={cache} hashPriority="high">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#5A54F9',
              borderRadius: 2,
            },
            components: {
              Layout: {
                siderBg: '#4F46E5',
              },
              Table: {
                headerBg: '#828EF7',
                headerColor: '#ffffff',
                headerBorderRadius: 4,
                rowHoverBg: '#EEF2FF',
              },
              Menu: {
                darkItemBg: '#4F46E5',
                darkPopupBg: '#5048E4',
                darkItemHoverBg: '#443AC8',
              },
              Input: {},
            },
          }}
        >
          {children}
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  )
}
