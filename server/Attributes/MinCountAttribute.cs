using System.ComponentModel.DataAnnotations;

namespace server
{
    public class MinCountAttribute : ValidationAttribute
    {
        private readonly int _minCount;

        public MinCountAttribute(int minCount)
        {
            _minCount = minCount;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is ICollection<object> collection)
            {
                if (collection.Count < _minCount)
                {
                    return new ValidationResult($"You must select at least {_minCount} tags.");
                }
            }
            else if (value is IEnumerable<string> list)
            {
                if (list.Count() < _minCount)
                {
                    return new ValidationResult($"You must select at least {_minCount} tags.");
                }
            }
            else if (value == null)
            {
                return new ValidationResult($"You must select at least {_minCount} tags.");
            }

            return ValidationResult.Success;
        }
    }
}
