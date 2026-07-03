export interface TreeNode {
  children?: TreeNode[];
  [key: string]: unknown;
}

export function traverseTree<T extends TreeNode>(node: T, itemFunction?: (node: TreeNode) => void): T {
  node.children?.forEach((child) => {
    itemFunction?.(child);
    traverseTree(child, itemFunction);
  });
  return node;
}
