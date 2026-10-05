# info_popover — small explanation popover

Content widget for an info icon: a heading and a short text. Open it from any card with an `oh-link` on a round `f7:info_circle` icon:

```yaml
- component: oh-link
  config:
    action: popover
    actionModal: widget:info_popover
    actionModalConfig: { title: Memory, text: "RAM used, swap and the openHAB Java heap." }
  slots:
    default:
      - component: oh-icon
        config: { icon: f7:info_circle, style: { font-size: 15px, opacity: 0.5 } }
```

Popovers open on tap or click; Main UI has no hover action. Used by `stat_tile` (`info` prop) and `server_status_card`.

## Props
| Prop | Required | Description |
|---|---|---|
| `title` | No | Popover heading |
| `text` | Yes | Explanation text |

## Changelog

### Version 1.0.0

- Initial release.
