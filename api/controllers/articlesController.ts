import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { User, IArticle } from "@lonper/types";

class ArticlesController {
  /**
   * Get articles by their IDs.
   * @param c - Hono context object.
   * @returns JSON response with the articles data or an error message.
   */
  static async getArticlesByIds(c: Context) {
    try {
      const { articleIds }: { articleIds: string[] } = await c.req.json();
      const user: User = c.get("user");
      const commercialData = user.user_metadata?.commercialData || {};
      const {
        commercialDiscount1 = 0,
        commercialDiscount2 = 0,
        commercialDiscount3 = 0,
        clientNumber,
      } = commercialData;

      const { data: articlesFromDatabase, error } = await config.database
        .from("ARTICLES")
        .select("*")
        .in("ARTICLE", articleIds);

      if (error) {
        console.error("Error fetching articles:", error);
        return c.json(
          { error: "Internal server error while getting the articles by ids." },
          500
        );
      }

      const articles: IArticle[] = Case.deepConvertKeys(
        articlesFromDatabase,
        Case.toCamelCase
      );

      for (let i = 0; i < articles.length; i++) {
        const salePrice = articles[i].salePrice;
        let dto1 = 0;
        let dto2 = 0;
        let dto3 = 0;
        let clientsFamilyDtoData = [];

        if (clientNumber) {
          const { data } = await config.database
            .from("CLIENTS_FAMILY_DTO")
            .select("DTO_1, DTO_2, DTO_3")
            .eq("CLIENT_CODE", clientNumber)
            .eq("FAMILY_CODE", articles[i].familyCode);

          clientsFamilyDtoData = data || [];

          if (clientsFamilyDtoData.length > 0) {
            const { DTO_1, DTO_2, DTO_3 } = clientsFamilyDtoData[0];

            dto1 = DTO_1;
            dto2 = DTO_2;
            dto3 = DTO_3;

            if (DTO_1 !== 0) {
              articles[i].salePrice -= articles[i].salePrice * (DTO_1 / 100);
            }

            if (DTO_2 !== 0) {
              articles[i].salePrice -= articles[i].salePrice * (DTO_2 / 100);
            }

            if (DTO_3 !== 0) {
              articles[i].salePrice -= articles[i].salePrice * (DTO_3 / 100);
            }
          } else {
            dto1 = commercialDiscount1;
            dto2 = commercialDiscount2;
            dto3 = commercialDiscount3;

            if (commercialDiscount1 !== 0) {
              articles[i].salePrice -=
                articles[i].salePrice * (commercialDiscount1 / 100);
            }

            if (commercialDiscount2 !== 0) {
              articles[i].salePrice -=
                articles[i].salePrice * (commercialDiscount2 / 100);
            }

            if (commercialDiscount3 !== 0) {
              articles[i].salePrice -=
                articles[i].salePrice * (commercialDiscount3 / 100);
            }
          }
        } else {
          dto1 = commercialDiscount1;
          dto2 = commercialDiscount2;
          dto3 = commercialDiscount3;

          if (commercialDiscount1 !== 0) {
            articles[i].salePrice -=
              articles[i].salePrice * (commercialDiscount1 / 100);
          }

          if (commercialDiscount2 !== 0) {
            articles[i].salePrice -=
              articles[i].salePrice * (commercialDiscount2 / 100);
          }

          if (commercialDiscount3 !== 0) {
            articles[i].salePrice -=
              articles[i].salePrice * (commercialDiscount3 / 100);
          }
        }

        articles[i].salePriceBeforeDiscount = salePrice;
        articles[i].dto1 = dto1;
        articles[i].dto2 = dto2;
        articles[i].dto3 = dto3;
      }

      return c.json(articles, 200);
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while getting the articles by ids." },
        500
      );
    }
  }
}

export default ArticlesController;
