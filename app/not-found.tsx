import Link from "next/link"
import { PageHeader } from "@/components/page-header"

const NotFound = () => (
  <>
    <PageHeader
      kicker="404"
      title="ページが見つかりません"
      lead="お探しのページは移動または削除された可能性があります。"
    />
    <p>
      <Link href="/" className="more">
        トップページへ戻る
      </Link>
    </p>
  </>
)

export default NotFound
