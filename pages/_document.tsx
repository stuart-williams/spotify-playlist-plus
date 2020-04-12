import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { parseCookies } from "nookies";

interface Props {
  classes: string;
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      classes: token ? "bp3-dark" : "",
    };
  }

  render() {
    return (
      <Html lang="en" className={this.props.classes}>
        <Head />
        <body className={this.props.classes}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
