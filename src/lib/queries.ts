import { queryOptions } from "@tanstack/react-query";
import {
  getPage,
  getPortfolioItem,
  getPost,
  listPortfolio,
  listPosts,
} from "./content.functions";

export const portfolioListQuery = () =>
  queryOptions({
    queryKey: ["portfolio"],
    queryFn: () => listPortfolio(),
  });

export const portfolioItemQuery = (slug: string) =>
  queryOptions({
    queryKey: ["portfolio", slug],
    queryFn: () => getPortfolioItem({ data: { slug } }),
  });

export const postListQuery = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: () => listPosts(),
  });

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["posts", slug],
    queryFn: () => getPost({ data: { slug } }),
  });

export const pageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["pages", slug],
    queryFn: () => getPage({ data: { slug } }),
  });