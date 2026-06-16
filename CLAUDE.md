# CLAUDE.md — Hệ Thống Đa-Agent cho Project Ladipage

> File này hướng dẫn Claude Code khi làm việc trong project này.
> Kiến trúc dựa trên framework "Hệ Thống Đa Agent" — áp dụng cho phát triển, audit,
> reverse-engineer UI, và tự động hoá web.

## 0. Nguyên tắc vàng (BẮT BUỘC)

1. **"Một prompt = một phần; phân tích TRƯỚC, hành động SAU."**
   Không clone/refactor/deploy khi chưa phân tích xong phần đang xử lý.
2. **Output luôn bằng tiếng Việt, ngôn ngữ phi kỹ thuật** cho phần báo cáo cho người dùng
   (tổng quan, danh sách lỗi, đề xuất, trạng thái). Chi tiết kỹ thuật để trong code/phụ lục.
3. **An toàn trước tốc độ:** backup (git) trước khi deploy; refactor phải giữ nguyên hành vi
   trừ khi được yêu cầu đổi.
4. **Phân loại lỗi rõ ràng:** `CRITICAL` (crash/sai dữ liệu) → `MAJOR` (lỗi chức năng) →
   `MINOR` (style/đề xuất).

## 1. Pipeline phát triển

```
IDEA / TODO
   ↓
Execution Roadmap (PLAN)          → agent: system-auditor-release-manager / /plan
   ↓
Stack Selection
   ↓
Design  (chạy SYSTEM X-RAY nếu đã có hệ cũ)   → agent: system-xray-architect
   ↓
BUILD
   ↓
TEST                              → agent: qa-automation-agent (playwright)
   ↓
SYSTEM X-RAY (quét hệ vừa build)  → agent: system-xray-architect
   ↓
REFACTOR ENGINE (tối ưu + dọn dẹp) → agent: safe-refactor-engine
   ↓
VERIFY → deploy
```

### Luồng Audit → Refactor (cho hệ thống có sẵn)
```
SYSTEM X-RAY → 1.Fix CRITICAL → 2.Đề xuất kiến trúc mới → 3.HUMAN REVIEW
            → 4.AI Refactor → 5.TEST (UI/API/Flow) → 6.X-RAY lại để xác minh
```

## 2. Bộ Agent (xem .claude/agents/)

| Agent | Khi nào dùng | MCP chính |
|-------|--------------|-----------|
| `system-auditor-release-manager` | Audit repo, backup, deploy, đề xuất phase | git, firecrawl |
| `mcp-chrome-power-user` | Inspect realtime, trace JS/network/state, debug | chrome-devtools |
| `qa-automation-agent` | Giả lập user mobile, test flow, log bug | playwright |
| `system-xray-architect` | Quét toàn bộ codebase + runtime, vẽ bản đồ | chrome-devtools |
| `safe-refactor-engine` | Tái kiến trúc giữ nguyên hành vi | — |
| `mcp-n8n-integrator` | Thiết kế tích hợp MCP + n8n + UI components | n8n, magic |

## 3. Slash Commands (xem .claude/commands/)

| Lệnh | Tác dụng |
|------|----------|
| `/landing-prompt <sp>` | Soạn prompt landing page chuẩn theo khung A–I (làm rõ ngữ cảnh → wireframe → xuất prompt) (skill `landing-prompt`) |
| `/fcb-copy <sp>` | Cấu trúc + copy chuyển đổi cao bằng FCB + tâm lý học (5 bước: FCB → tâm lý → cấu trúc → copy → CRO) (skill `fcb-copywriting`) |
| `/web <url>` | Điều phối: tự chọn skill phù hợp (inspect / extract / clone / audit) |
| `/inspect-site <url>` | Phân tích sâu 1 trang: DOM, JS events, network, state |
| `/clone-ui <url> [phần]` | Clone component pixel-perfect (phân tích trước, clone sau) |
| `/clone-template <url>` | Clone CẢ trang/template: EXTRACT → X-RAY → BUILD → VERIFY → TRACKING (skill `clone-template`) |
| `/xray <url>` | Trích xuất DOM/hành vi/logic → xuất `SYSTEM-XRAY.md` 9 phần, KHÔNG code (skill `clone-template`) |
| `/audit-site <url>` | Audit bug / security / performance, báo cáo phân loại |
| `/tracking-setup <domain>` | Dựng tracking Meta 4 lớp (Pixel+CAPI+EMQ+Dedup) cho landing/SaaS (skill `meta-tracking`) |
| `/nurture-setup <sp>` | Dựng chuỗi email nuôi dưỡng lead trên n8n, nội dung sửa trên Lark (skill `lead-nurture`) |

> **Skills marketing-automation** (`.claude/skills/`): `landing-prompt`, `fcb-copywriting`, `clone-template`, `meta-tracking`, `lead-nurture`.
> Giá CinAI dùng chung: `templates/_shared/cinai-pricing.md` (+ `.json`) — source of truth cho mọi landing.
> Hạ tầng n8n dùng chung: `automation/n8n/` (workflow tracking + nurture, đã validate).

Cũng có thể **nói tự nhiên tiếng Việt + dán URL** → AI tự chọn đúng agent/skill.

## 4. Bản đồ MCP của project (.mcp.json)

| MCP | Dùng cho |
|-----|----------|
| **chrome-devtools** | Inspect realtime, console, network, performance, snapshot |
| **playwright** | Tự động hoá hành vi user, test flow, screenshot, emulate mobile |
| **firecrawl** | Scrape/crawl/search/extract nội dung web có cấu trúc |
| **magic** (21st.dev) | Sinh component UI / logo cho việc clone & build |
| **n8n** | Thiết kế & validate workflow automation/backend |
| **lark** | Thông báo / tích hợp Feishu/Lark |

Secrets được nạp từ biến môi trường (`${VAR}`), không hardcode. Xem `.env.example`.

## 5. Yêu cầu Output (mọi agent)

Mỗi lần hoàn thành tác vụ lớn, trả về (tiếng Việt, dễ hiểu):
1. **Tổng quan** — đã làm gì, hệ thống đang ở trạng thái nào.
2. **Danh sách lỗi/phát hiện** — phân loại Critical / Major / Minor + nguyên nhân gốc.
3. **Đề xuất fix** — giải thích đơn giản, kèm phương án.
4. **Trạng thái deploy** — `OK` / `BLOCKED` (và lý do nếu blocked).
5. **Phase tiếp theo** — gợi ý bước kế.
